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
using Infrastructure.Email;
using Microsoft.AspNetCore.WebUtilities;
using System.Text;

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
        private readonly EmailSender _emailSender;
        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> sigInManager,TokenService tokenService,IConfiguration config,EmailSender emailSender)
        {
            _emailSender = emailSender;
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
                return Unauthorized("Invalid Email");
            }//end if (user==null)

            
            if(!user.EmailConfirmed) return Unauthorized("Email Not Confirmed");

            var result= await _sigInManager.CheckPasswordSignInAsync(user,logindto.Password,false);
            if (result.Succeeded)
            {
                await SetRefreshToken(user);
                return CreateUserObject(user);
            }//end  if (result.Succeeded)

            return Unauthorized("Invalid Password");
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

            if(!result.Succeeded) return BadRequest("Problem registering user");
            var origin = Request.Headers["origin"];
            var token= await _userManager.GenerateEmailConfirmationTokenAsync(user);
            //This line is to protect the token,because we are going to send it as HTML
            //we will need to encode the token for do not be modify in it's way down to the client
            //You will have to encode it in the way out and decode in the way back ther will problems
            token= WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

            var verifyURL=$"{origin}/account/verifyEmail?token={token}&email={user.Email}";
            var message =$"<p>PLease click the below Link to verify the Email addres:</p><p><a href='{verifyURL}'>Click to verify Email</a></p>";

            await _emailSender.SendEmailAsync(user.Email, "Please Verify Email", message);

            return Ok("Registration success -- Please verify email");
        }//end  Register

        [AllowAnonymous]
        [HttpPost("verifyEmail")]
        public async Task<ActionResult> VerifyEmail(string token,string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if(user == null) return Unauthorized();
            var decodeTokenBytes = WebEncoders.Base64UrlDecode(token);
            var decodeToken= Encoding.UTF8.GetString(decodeTokenBytes);
            var result= await _userManager.ConfirmEmailAsync(user,decodeToken);

            if(!result.Succeeded) return BadRequest("Could not verify email addres");

            return Ok("Email confirmed - you can now login");

        }//end VerifyEmail

        [AllowAnonymous]
        [HttpGet("resendEmailConfirmationLink")]
        public async Task<IActionResult> ResendEmailConfirmationLink(string email)
        {
            var user= await _userManager.FindByEmailAsync(email);

            if (user == null) return Unauthorized();

            var origin = Request.Headers["origin"];
            var token= await _userManager.GenerateEmailConfirmationTokenAsync(user);
            //This line is to protect the token,because we are going to send it as HTML
            //we will need to encode the token for do not be modify in it's way down to the client
            //You will have to encode it in the way out and decode in the way back ther will problems
            token= WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

            var verifyURL=$"{origin}/account/verifyEmail?token={token}&email={user.Email}";
            var message =$"<p>PLease click the below Link to verify the Email addres:</p><p><a href='{verifyURL}'>Click to verify Email</a></p>";

            await _emailSender.SendEmailAsync(user.Email, "Please Verify Email", message);

            return Ok("Email verifycation Link resent");


        }//end ResendEmailConfirmationLink

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<UserDto>> GetCurrentUser(){
            var user =await _userManager.Users.Include(p=>p.Photos)
                .FirstOrDefaultAsync(x=>x.Email==User.FindFirstValue(ClaimTypes.Email));

            //Adding the SetRefreshToken method is not mandatory
            //Is more for developer descition
            await SetRefreshToken(user);    
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

            await SetRefreshToken(user);
            return CreateUserObject(user);
            
        }//end FacebookLogin


        [Authorize]
        [HttpPost("refreshToken")]
        public async Task<ActionResult<UserDto>> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            var user = await _userManager.Users
                                .Include(r=>r.RefreshTokens)
                                .Include(p=>p.Photos)
                                .FirstOrDefaultAsync(x=>x.UserName == User.FindFirstValue(ClaimTypes.Name));

            if(user == null) return Unauthorized();

            var oldToken= user.RefreshTokens.SingleOrDefault(x=>x.Token ==refreshToken);

            if(oldToken != null && !oldToken.IsActive) return Unauthorized();

            if(oldToken != null) oldToken.Revoked=DateTime.UtcNow;

            return CreateUserObject(user);

        }//end RefreshToken


        private async Task SetRefreshToken(AppUser user){
            var refreshToken = _tokenService.GenerateRefreshToken();
            
            user.RefreshTokens.Add(refreshToken);

            await _userManager.UpdateAsync(user);

            var cookieOptions= new CookieOptions 
            {
                //This option is for access the cookie only from the server
                //Not the client
                HttpOnly=true,
                Expires= DateTime.UtcNow.AddDays(7)

            };

            Response.Cookies.Append("refreshToken",refreshToken.Token,cookieOptions );

        }//end SetRefreshToken

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