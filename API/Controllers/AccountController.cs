using System;
using System.Collections.Generic;
using System.Diagnostics.Eventing.Reader;
using System.Linq;
using System.Reflection;
using System.Security;
using System.Security.Authentication.ExtendedProtection;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extentions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.EntityFrameworkCore.Metadata;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<User> _userManager;
        private readonly TokenService _tokenService;
        private readonly StoreContext _context;

        public AccountController(UserManager<User> userManager, TokenService tokenService, StoreContext context)
        {
            _context = context;
            _tokenService = tokenService;
            _userManager = userManager;
        }


        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {

            User user = await _userManager.FindByNameAsync(loginDto.Username);
            bool checkPassword = await _userManager.CheckPasswordAsync(user, loginDto.Password);



            if (user == null || checkPassword == false)
                return Unauthorized();

            /*if the current  user  already  have "Basket" info on the server db ,and there is annoynouse basket, thenn delete
             the basket on the db, and attach the annoynomous basket to the current user*/
            Basket userBasket = await RetrieveBasket(loginDto.Username);
            Basket anonnymousBasket = await RetrieveBasket(Request.Cookies["buyerId"]);

            if (anonnymousBasket != null)
            {
                if (userBasket != null)
                {
                    _context.Baskets.Remove(userBasket);
                    anonnymousBasket.buyerId = user.UserName;
                    Response.Cookies.Delete("buyerId");

                    await _context.SaveChangesAsync();
                }
            }


            bool isPasswordPassed = await _userManager.CheckPasswordAsync(user, loginDto.Password);

            if (isPasswordPassed == false)
                return Unauthorized();
            else
            {
                UserDto userDto = new UserDto
                {
                    Email = user.Email,
                    Token = await _tokenService.GenerateToken(user),
                    Basket = anonnymousBasket != null ? anonnymousBasket.MapBasketToDto() : userBasket?.MapBasketToDto()
                };

                return userDto;
            }
        }




        [HttpPost("register")] 
        public async Task<ActionResult> Register(RegisterDto registerDto)
        {
            User user = new User
            {
                UserName = registerDto.Username,
                Email = registerDto.Email
            };

            IdentityResult result = await _userManager.CreateAsync(user, registerDto.Password);

            if (result.Succeeded == false)
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(error.Code, error.Description);
                }

                return ValidationProblem();
            }
            else//register succeded 
            {
                await _userManager.AddToRoleAsync(user, "Member");

                return StatusCode(201);//return "sucesss"  api code
            }
        }

        [Authorize]
        [HttpGet("currentUser")]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.FindByNameAsync(User.Identity.Name);//  the "Name" claim from the token

            Basket userBasket=await RetrieveBasket(User.Identity.Name);

            UserDto userDto = new UserDto()
            {
                Email = user.Email,
                Token = await _tokenService.GenerateToken(user),
                Basket=userBasket?.MapBasketToDto()
            };

            return userDto;
        }

        private async Task<Basket> RetrieveBasket(string buyerId)
        {
            if (string.IsNullOrEmpty(buyerId))
            {
                Response.Cookies.Delete("buyerId");
                return null;
            }

            Basket basket = await _context.Baskets
                                .Include(i => i.Items)//include the items information 
                                .ThenInclude(p => p.Product)//include the product in the items
                                .FirstOrDefaultAsync(x => x.buyerId == buyerId);

            return basket;
        }
    }
}