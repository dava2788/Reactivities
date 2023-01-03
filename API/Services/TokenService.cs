using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Domain;
using Microsoft.IdentityModel.Tokens;

namespace API.Services
{
    public class TokenService
    {
        private readonly IConfiguration _config;
        public TokenService(IConfiguration config)
        {
            _config = config;

        }//end constructor TokenService

        public string CreateToken (AppUser user){
            //this will be the Claim the JWT will have inside
            var claims = new List<Claim>{
                new Claim(ClaimTypes.Name,user.UserName),
                new Claim(ClaimTypes.NameIdentifier,user.Id),
                new Claim(ClaimTypes.Email,user.Email)
            };

            //Now we sign the Token
            //For this we need a Key
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["TokenKey"]));
            //Now generate credential
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            //now describe the Token
            var TokenDescriptor= new SecurityTokenDescriptor{
                Subject=new ClaimsIdentity(claims),
                Expires=DateTime.UtcNow.AddMinutes(1),
                SigningCredentials= creds
            };//end TokenDescriptor

            //create token handler for create the Token itselft
            var tokenHandler = new JwtSecurityTokenHandler();
            //create now the token
            var token = tokenHandler.CreateToken(TokenDescriptor);
            //Return the JWT token
            return tokenHandler.WriteToken(token);

        }//end CreateToken

        public RefreshToken GenerateRefreshToken(){
            var randomNumber= new byte[32];
            using var rng =RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return new RefreshToken
            {
                Token=Convert.ToBase64String(randomNumber)
            };

        }//end GenerateRefreshToken
        
    }//end class TokenService
}//end namespace