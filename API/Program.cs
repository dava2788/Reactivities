using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Persistence;
using MediatR;
using Application.Activities;
using Application.Core;
using AutoMapper;
using API.Extensions;
using FluentValidation.AspNetCore;
using API.Middleware;
using Microsoft.AspNetCore.Identity;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using API.SignalR;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
//Adding Authorization to the application
builder.Services.AddControllers(opt=>{
    var policy= new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
    opt.Filters.Add(new AuthorizeFilter(policy));
})
    .AddFluentValidation(Config=>
{
    Config.RegisterValidatorsFromAssemblyContaining<Create>();

});

//This call is for use the AddApplicationServices class
//to set up the services we want to use
builder.Services.AddApplicationServices(builder.Configuration);
//Adding services related to identity autentication section 12
builder.Services.AddIdentityServices(builder.Configuration);

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
// builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen();

var app = builder.Build();

//This is for get our own exception (Error) middleware
app.UseMiddleware<ExceptionMiddleware>();// Configure the HTTP request pipeline.

if (app.Environment.IsDevelopment())
{  
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "WebAPIv5 v1"));
}

// app.UseHttpsRedirection();

app.UseRouting();

app.UseCors("CorsPolicy");
//app.UseCors(options =>options.WithOrigins("http://localhost:3000").AllowAnyMethod().AllowAnyHeader());
//app.UseCors(options =>options.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

//Order is important first need to be UseAuthentication then UseAuthorization
app.UseAuthentication();
app.UseAuthorization();

app.UseEndpoints(endpoints =>{
    endpoints.MapControllers();
    });

//Map the ChatHub and the root will be chat
app.MapHub<ChatHub>("/chat");


using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
try{
    
    var context = services.GetRequiredService<DataContext>();
    var userManager= services.GetRequiredService<UserManager<AppUser>>();
    
    await context.Database.MigrateAsync();
    await Seed.SeedData(context,userManager);
}//end try
catch(Exception ex){
    var logger =services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex,"An Error Occured during migration");

}//end catch

await app.RunAsync();
