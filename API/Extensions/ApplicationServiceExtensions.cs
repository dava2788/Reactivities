using Application.Activities;
using Application.Interfaces;
using FluentValidation;
using Infrastructure.Photos;
using Infrastructure.Security;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services,IConfiguration config)
        {
            services.AddSwaggerGen(c=>{
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "WebAPIv5", Version = "v1" });

            });


            #region For connect to the Posgress DB using appSettings
            // services.AddDbContext<DataContext>(opt=>{
            //     // THIS IS THE DefaultConnection STRING IN THE APP SETTING FILE
            //     // opt.UseNpgsql(config.GetConnectionString("DefaultConnection"));
            // });
            #endregion

            #region For connect to the postress DB in Flyctl
            services.AddDbContext<DataContext>(options =>
            {
                //This for get what is the current envirement Development or production
                var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

                string connStr;

                // Depending on if in development or production, use either FlyIO
                // connection string, or development connection string from env var.
                if (env == "Development")
                {
                    // Use connection string from file.
                    connStr = config.GetConnectionString("DefaultConnection");
                }
                else
                {
                    // Use connection string provided at runtime by FlyIO.
                    var connUrl = Environment.GetEnvironmentVariable("DATABASE_URL");

                    // Parse connection URL to connection string for Npgsql
                    connUrl = connUrl.Replace("postgres://", string.Empty);
                    var pgUserPass = connUrl.Split("@")[0];
                    var pgHostPortDb = connUrl.Split("@")[1];
                    var pgHostPort = pgHostPortDb.Split("/")[0];
                    var pgDb = pgHostPortDb.Split("/")[1];
                    var pgUser = pgUserPass.Split(":")[0];
                    var pgPass = pgUserPass.Split(":")[1];
                    var pgHost = pgHostPort.Split(":")[0];
                    var pgPort = pgHostPort.Split(":")[1];

                    connStr = $"Server={pgHost};Port={pgPort};User Id={pgUser};Password={pgPass};Database={pgDb};";
                }

                // Whether the connection string came from the local development configuration file
                // or from the environment variable from FlyIO, use it to set up your DbContext.
                options.UseNpgsql(connStr);
            });

            #endregion

            

            services.AddCors(opt=>{
                opt.AddPolicy("CorsPolicy",policy=>{
                    
                    //The policy "AllowCredentials" is allow the signalR authorization
                    policy
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials()
                        .WithExposedHeaders("WWW-Authenticate","Pagination")
                        .WithOrigins("http://localhost:3000","https://localhost:3000");
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
            //Adding the AddFluentValidationAutoValidation
            services.AddFluentValidationAutoValidation();
            services.AddValidatorsFromAssemblyContaining<Create>();


            return services;
        }//end AddApplicationServices 
    }//end class AppicationServicerExtensions
}