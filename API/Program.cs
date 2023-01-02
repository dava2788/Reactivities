using Application.Activities;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
//Adding Authorization to the application
builder.Services.AddControllers(opt=>{
    var policy= new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
    opt.Filters.Add(new AuthorizeFilter(policy));
});

//This call is for use the AddApplicationServices class
//to set up the services we want to use
builder.Services.AddApplicationServices(builder.Configuration);
//Adding services related to identity autentication section 12
builder.Services.AddIdentityServices(builder.Configuration);

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
// builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen();

//Adding MiddleWare
//Configure the Http Request pipeline
var app = builder.Build();

//This is for get our own exception (Error) middleware
app.UseMiddleware<ExceptionMiddleware>();// Configure the HTTP request pipeline.

//Adding security required Headers
//this one is for prevents the mime sniffing of the content type
app.UseXContentTypeOptions();
//this one refers to the referrer policy that allows a site to control how much info the browser includes
//when nabaigating away from our app
app.UseReferrerPolicy(opt=>opt.NoReferrer());
//this one will add a cross-site scripting protection header
app.UseXXssProtection(opt=>opt.EnabledWithBlockMode());
//This one is for prevents our app being used inside an iframe which protects against click jacking
app.UseXfo(opt=>opt.Deny());
//This one is the main defense against the cross-site scrippting attacks
//allow us to white source approve content
//This content will be allow 
app.UseCsp(opt=>opt
    .BlockAllMixedContent()
    .StyleSources(s=>s.Self().CustomSources("https://fonts.googleapis.com","https://cdn.jsdelivr.net/"))
    .FontSources(s=>s.Self().CustomSources("https://fonts.gstatic.com/","data:","https://cdn.jsdelivr.net/"))
    .FormActions(s=>s.Self())
    .FrameAncestors(s=>s.Self())
    .ImageSources(s=>s.Self().CustomSources("blob:","https://res.cloudinary.com"))
    .ScriptSources(s=>s.Self())
);

if (app.Environment.IsDevelopment())
{  
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "WebAPIv6 v1"));
}else{
    //adding a header only for production
    //the Strict-Transport-Security header
    app.Use(async(context, next)=>
    {
        //One year will 31536000
        context.Response.Headers.Add("Strict-Transport-Security","max-age=31536000");
        await next.Invoke();

    });
}


app.UseCors("CorsPolicy");
//app.UseCors(options =>options.WithOrigins("http://localhost:3000").AllowAnyMethod().AllowAnyHeader());
//app.UseCors(options =>options.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

//Order is important first need to be UseAuthentication then UseAuthorization
app.UseAuthentication();
app.UseAuthorization();

//this is for the content of wwroot
//After we use the npm run build for create the
//wwroot folder in the API
app.UseDefaultFiles();
app.UseStaticFiles();



app.MapControllers();
//Map the ChatHub and the root will be chat
app.MapHub<ChatHub>("/chat");
//this is the wat to active the fullback controller 
//for sync the wwwroot react app 
app.MapFallbackToController("Index","Fullback");


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
