

//DOTNET  HOST : 
WebApplicationBuilder builder = WebApplication.CreateBuilder(args);
//---------------------------------------------
//adding SERVICES CONFIGURATION  : 
//---------------------------------------------
builder.Services.AddControllers();

builder.Services.AddAutoMapper(typeof(MappingProfiles).Assembly);

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "WebAPIv5", Version = "v1" });
    //adding token support at the "Swagger" tool
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Jwt auth header",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    
    c.AddSecurityRequirement(new OpenApiSecurityRequirement{
        {
            //the goal is so we can send "bearer" token that we getting back from the login ,
            // and so we ccould pass it in the header of the API requests
                new OpenApiSecurityScheme{
                Reference=new OpenApiReference{
                    Type=ReferenceType.SecurityScheme,
                    Id="Bearer"
                } ,
                Scheme="oauth2",
                Name="Bearer",
                In=ParameterLocation.Header
                },
                new List<string>()
        }
    });
});

builder.Services.AddDbContext<StoreContext>(options =>
{
    var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

    string connStr;

    if (env == "Development")
    {
        // Use connection string from file.
        connStr = builder.Configuration.GetConnectionString("DefaultConnection");
        //options.UseNpgsql(connStr);
        options.UseSqlite(connStr);
    }
    else
    {
        // Use connection string provided at runtime by Heroku.
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

        connStr = $"Server={pgHost};Port={pgPort};User Id={pgUser};Password={pgPass};Database={pgDb};SSL Mode=Require;Trust Server Certificate=true";

        // Whether the connection string came from the local development configuration file
        // or from the environment variable from Heroku, use it to set up your DbContext.
        options.UseNpgsql(connStr);
    }
});

builder.Services.AddCors();

//must order be "AddIdentityCore" before "AddAuthentication" before "AddAuthorization"
builder.Services.AddIdentityCore<User>(
    options =>
    {
        options.User.RequireUniqueEmail = true;
    })
        .AddRoles<Role>()
        .AddEntityFrameworkStores<StoreContext>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = false,//the API issuer is http://localhost:5000,so turning the issuer validation to false cause no need to validate the  domain 
                ValidateAudience = false,//Audience = the address of the client of the localhost ,so turning the issuer validation to false cause no need to validate the url 
                ValidateLifetime = true,//we gave the  token  exipry date , we need to validate that the token didnt expired 
                ValidateIssuerSigningKey = true,//checking the secret key that identical to the signature in the server
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWTSettings:TokenKey"]))//creating the new symmetric key that matechs the one in the seerver
            };
        });


builder.Services.AddAuthorization();

builder.Services.AddScoped<TokenService>();//scoped: the "TokenService"  will be available only until the request ends

builder.Services.AddScoped<PaymentService>();

builder.Services.AddScoped<ImageService>();


//---------------------------------------------
//adding APP CONFIGURATION MIDDLEWARE: 
//---------------------------------------------
WebApplication app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();

if (builder.Environment.IsDevelopment())
{
    //  app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "WebAPIv5 v1"));
}

//app.UseHttpsRedirection();

//app.UseRouting();

app.UseDefaultFiles();

app.UseStaticFiles();


app.UseCors(opt =>
{
    opt.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:3000");
});

app.UseAuthentication();// authentication must come before authorization 

app.UseAuthorization();


app.MapControllers();

app.MapFallbackToController("Index", "Fallback");



//---------------------------------------------
//adding DB SEEDING: 
//---------------------------------------------


using var scope = app.Services.CreateScope();
var context = scope.ServiceProvider.GetRequiredService<StoreContext>();
var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();

try
{
    await context.Database.MigrateAsync();
    await DbInitializer.Initialize(context, userManager);
}
catch (Exception ex)
{
    logger.LogError(ex, "Problem migrating data");
}
finally
{
    //    scope.Dispose();
}

await app.RunAsync();

