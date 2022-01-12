using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Security;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<User> _userManager;
        private readonly TokenService _tokenService;

        public AccountController(UserManager<User> userManager, TokenService tokenService)
        {
            _tokenService = tokenService;
            _userManager = userManager;
        }


        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {

            User user = await _userManager.FindByNameAsync(loginDto.Username);

            if (user == null)
                return Unauthorized();

            bool isPasswordPassed = await _userManager.CheckPasswordAsync(user, loginDto.Password);

            if (isPasswordPassed == false)
                return Unauthorized();
            else
            {
                UserDto userDto = new UserDto
                {
                    Email = user.Email,
                    Token = await _tokenService.GenerateToken(user)
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
                var user=await _userManager.FindByNameAsync(User.Identity.Name);//  the "Name" claim from the token

                UserDto userDto=new UserDto(){
                    Email=user.Email,
                    Token=await _tokenService.GenerateToken(user)
                };

                return userDto;
         }
    }
}