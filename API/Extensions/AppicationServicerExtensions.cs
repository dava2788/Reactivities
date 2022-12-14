using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Activities;
using Application.Core;
using Application.Interfaces;
using Infrastructure.Photos;
using Infrastructure.Security;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Persistence;

namespace API.Extensions
{
    public static class AppicationServicerExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services,IConfiguration config)
        {
            services.AddSwaggerGen(c=>{
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "WebAPIv5", Version = "v1" });

            });


            services.AddDbContext<DataContext>(opt=>{
                opt.UseSqlite(config.GetConnectionString("DefaultConnection"));
            });

            services.AddCors(opt=>{
                opt.AddPolicy("CorsPolicy",policy=>{
                    
                    //The policy "AllowCredentials" is allow the signalR authorization
                    policy.AllowAnyMethod().AllowAnyHeader().AllowCredentials().WithOrigins("http://localhost:3000");
                    //policy.AllowAnyMethod().AllowAnyHeader().AllowAnyOrigin();
                });

            });
            services.AddMediatR(typeof(List.Handler).Assembly);
            //Adding AutoMappert
            services.AddAutoMapper(typeof(MappingProfiles).Assembly);

            //Adding services from Infrastructure project
            //With this service we have the ability to get the currently log in User, Username anywehre in our application
            services.AddScoped<IUserAccessor,UserAccessor>();
            //For implement the PhotoAccessor class
            services.AddScoped<IPhotoAccessor,PhotoAccessor>();
            //Add Cloudinary for Photo management, get from the appSettings.json the Cloudinary setting 
            //Using the CloudinarySettings for initialize
            services.Configure<CloudinarySettings>(config.GetSection("Cloudinary"));
            //Adding SIgnalR  as a service
            services.AddSignalR();


            return services;
        }//end AddApplicationServices 
    }//end class AppicationServicerExtensions
}