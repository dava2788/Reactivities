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
using Infrastructure.Security;
using Microsoft.AspNetCore.Authorization;

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
                    ValidateAudience=false,
                    ValidateLifetime=true,
                    //This validator parameter is for avoid the  default lifetime 5 minutes window the system has configure.
                    //With option the default windows will be removed
                    ClockSkew= TimeSpan.Zero
                };
                //This is for authenticate in signalR
                //This is because for signalR 
                //Doesn't have ability to sedn a http authorization header to use for send the JWT
                //So, we will use the query string to send the jwt
                opt.Events= new JwtBearerEvents
                {
                    OnMessageReceived= context =>
                    {   
                        var accessToken=context.Request.Query["access_token"];
                        var path= context.HttpContext.Request.Path;
                        //With this we will verify the name of the root we config in program.cs. THe end point 
                        //we configure in program.cs
                        if(!string.IsNullOrEmpty(accessToken) && (path.StartsWithSegments("/chat")))
                        {
                            //Add the JWT to the context
                            context.Token=accessToken;
                        }
                        return Task.CompletedTask;
                    }
                };
            });

            services.AddAuthorization(options => {
                options.AddPolicy("IsActivityHost",policy=>{
                    //We add as a policy requirement the infrastructure class
                    //IsHostRequirement
                    policy.Requirements.Add(new IsHostRequirement());
                });
            });

            //With this line we can use attributes in our end points to add this policy
            services.AddTransient<IAuthorizationHandler,IsHostRequirementHandler>();

            //inject the Token service to the Program
            services.AddScoped<TokenService>();
            return services;

        }//end AddIdentityServices
        
    }//end class IdentityServiceExtensions
}//end namespace