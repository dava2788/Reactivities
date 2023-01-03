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
        private readonly IConfiguration _config;
        private readonly HttpClient _httpClient;
        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> sigInManager,TokenService tokenService,IConfiguration config )
        {
            _config = config;
            _tokenService = tokenService;
            _sigInManager = sigInManager;
            _userManager = userManager;
            _httpClient=new HttpClient
            {
                BaseAddress= new System.Uri("https://graph.facebook.com")
            };
                
        }//end AccountController

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto logindto){
            var user= await _userManager.Users.Include(p=>p.Photos)
                .FirstOrDefaultAsync(x=>x.Email==logindto.Email);

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
            var user =await _userManager.Users.Include(p=>p.Photos)
                .FirstOrDefaultAsync(x=>x.Email==User.FindFirstValue(ClaimTypes.Email));
                
            return CreateUserObject(user);
        }//end GetCurrentUser

        [AllowAnonymous]
        [HttpPost("fbLogin")]
        public async Task<ActionResult<UserDto>> FacebookLogin(string accessToken){
            var fbVerifyKeys=_config["Facebook:AppId"] + "|" + _config["Facebook:ApiSecret"];

            var verifyTokenResponse = await _httpClient.GetAsync($"debug_token?input_token={accessToken}&access_token={fbVerifyKeys}");

            if (!verifyTokenResponse.IsSuccessStatusCode) return Unauthorized();

            var fbUrl = $"me?access_token={accessToken}&fields=name,email,picture.width(100).height(100)";

            var fbInfo= await _httpClient.GetFromJsonAsync<FacebookDto>(fbUrl);

            var user= await _userManager.Users.Include(p=>p.Photos).FirstOrDefaultAsync(x=>x.Email==fbInfo.Email);

            if(user !=null) return CreateUserObject(user);

            user = new AppUser
            {
                DisplayName=fbInfo.Name,
                Email=fbInfo.Email,
                UserName=fbInfo.Email,
                Photos = new List<Photo>
                {
                    new Photo
                    {
                        id="fb_"+ fbInfo.Id,
                        Url=fbInfo.Picture.Data.Url,
                        IsMain=true
                    }
                }
            };

            var result = await _userManager.CreateAsync(user);

            if(!result.Succeeded) return BadRequest("Problem creating user account");

            
            return CreateUserObject(user);
            
        }//end FacebookLogin

        private UserDto CreateUserObject(AppUser user)
        {
            return new UserDto
            {
                    DisplayName=user.DisplayName,
                    Image=user?.Photos?.FirstOrDefault(x=>x.IsMain)?.Url,
                    Token=_tokenService.CreateToken(user),
                    Username=user.UserName
                };
        }//end CreateUserObject
    }//end AccountController
}//end namespace