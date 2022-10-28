using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace API.Controllers
{
    //this AllowAnonymous is for allow any request to hit this controller
    //Because we implement in the program authorizacion
    //But to get authorization we need to use this controller API
    [AllowAnonymous]
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _sigInManager;
        private readonly TokenService _tokenService;
        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> sigInManager,TokenService tokenService)
        {
            _tokenService = tokenService;
            _sigInManager = sigInManager;
            _userManager = userManager;
        }//end AccountController

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto logindto){
            var user= await _userManager.FindByEmailAsync(logindto.Email);
            if (user==null)
            {
                return Unauthorized();
            }//end if (user==null)

            var result= await _sigInManager.CheckPasswordSignInAsync(user,logindto.Password,false);
            if (result.Succeeded)
            {
                return CreateUserObject(user);
            }//end  if (result.Succeeded)
            return Unauthorized();
        }//end Login

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto ){
            if (await _userManager.Users.AnyAsync(x=> x.Email == registerDto.Email))
            {
                //This is for get the expected structure of the error and not return only a text string
                ModelState.AddModelError("email","Email Taken");
                return ValidationProblem(ModelState);
            }//end if (await _userManager.Users.AnyAsync(x=> x.Email == registerDto.Email))

            if (await _userManager.Users.AnyAsync(x=> x.UserName == registerDto.Username))
            {
                ModelState.AddModelError("UserName","UserName Taken");
                return ValidationProblem(ModelState);
            }//end if (await _userManager.Users.AnyAsync(x=> x.UserName == registerDto.Username))

            var user= new AppUser{
                DisplayName=registerDto.DisplayName,
                Email=registerDto.Email,
                UserName=registerDto.Username,
            };

            var result= await _userManager.CreateAsync(user,registerDto.Password);

            if (result.Succeeded)
            {
                return CreateUserObject(user);
            }//end if (result.Succeeded)
            
            return BadRequest("Problem registering user");
        }//end  Register

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<UserDto>> GetCurrentUser(){
            var user =await _userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));
            return CreateUserObject(user);
        }//end GetCurrentUser

        private UserDto CreateUserObject(AppUser user)
        {
            return new UserDto{
                    DisplayName=user.DisplayName,
                    Image=null,
                    Token=_tokenService.CreateToken(user),
                    Username=user.UserName
                };
        }//end CreateUserObject
    }//end AccountController
}//end namespace