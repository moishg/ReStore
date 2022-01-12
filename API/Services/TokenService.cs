using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace API.Services
{
    public class TokenService
    {
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _config;
        public TokenService(UserManager<User> userManager, IConfiguration config)
        {
            _config = config;
            _userManager = userManager;

        }

        ///creating the JWT token 
        public async Task<string> GenerateToken(User user)
        {
            //adding user details as claims
            List<Claim> claims = new List<Claim>//claim = something that the usser say that he is , like claiming my name is "bob",or claim that my role is "Member"
            {
                new Claim(ClaimTypes.Email,user.Email),
                new Claim(ClaimTypes.Name,user.UserName)
            };

            IList<string> roles = await _userManager.GetRolesAsync(user);


            //adding roles as claims to the token 
            foreach (string role in roles)
            {

                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            string configKey= _config["JWTSettings:TokenKey"].ToString();
            SymmetricSecurityKey key=new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configKey));
            SigningCredentials creds=new SigningCredentials(key,SecurityAlgorithms.HmacSha512);

            JwtSecurityToken tokenOptions= new JwtSecurityToken(
                    issuer:null,
                    audience:null,
                    claims:claims,
                    expires :DateTime.Now.AddDays(7),
                    signingCredentials:creds
            );

           JwtSecurityTokenHandler securityHandler=new JwtSecurityTokenHandler();
           string tokenDetails=securityHandler.WriteToken(tokenOptions);

           return tokenDetails;






        }
    }
}