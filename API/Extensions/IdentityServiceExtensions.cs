using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Persistence;
using System.Text;

namespace API.Extensions
{
    public static class IdentityServiceExtensions
    {
        public static IServiceCollection AddIdentityServices(this IServiceCollection services,IConfiguration config){
            services.AddIdentityCore<AppUser>(opt=>{
                opt.Password.RequireNonAlphanumeric=false;
            })
            .AddEntityFrameworkStores<DataContext>()
            .AddSignInManager<SignInManager<AppUser>>();
            
            //Now we sign the Token
            //For this we need a Key
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));


            //This is the services that will verify if any send JWT is valid
            //using the key we original use
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(opt=>{
                opt.TokenValidationParameters= new TokenValidationParameters{
                    ValidateIssuerSigningKey=true,
                    IssuerSigningKey=key,
                    ValidateIssuer=false,
                    ValidateAudience=false
                };
            });
            //inject the Token service to the Program
            services.AddScoped<TokenService>();
            return services;

        }//end AddIdentityServices
        
    }//end class IdentityServiceExtensions
}//end namespace