using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Portal.Api.Configuration;
using Portal.Api.Middleware;
using Portal.Application;
using Portal.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<AzureAdOptions>(
    builder.Configuration.GetSection(AzureAdOptions.SectionName));

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

var azureAdOptions = builder.Configuration
    .GetSection(AzureAdOptions.SectionName)
    .Get<AzureAdOptions>() ?? new AzureAdOptions();

var authority = $"{azureAdOptions.Instance.TrimEnd('/')}/{azureAdOptions.TenantId}/v2.0";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = authority;
        options.Audience = azureAdOptions.Audience;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            NameClaimType = "name",
            RoleClaimType = "roles",
            ValidateIssuer = true
        };

        options.Events = new JwtBearerEvents
        {
            OnTokenValidated = context =>
            {
                if (context.Principal?.Identity is not ClaimsIdentity identity)
                {
                    return Task.CompletedTask;
                }

                var groupIds = context.Principal.Claims
                    .Where(claim => claim.Type == "groups")
                    .Select(claim => claim.Value)
                    .ToHashSet(StringComparer.OrdinalIgnoreCase);

                if (!string.IsNullOrWhiteSpace(azureAdOptions.AdminGroupId) &&
                    groupIds.Contains(azureAdOptions.AdminGroupId))
                {
                    identity.AddClaim(new Claim(ClaimTypes.Role, "Admin"));
                    identity.AddClaim(new Claim("roles", "Admin"));
                }

                return Task.CompletedTask;
            },
            OnAuthenticationFailed = context =>
            {
                context.NoResult();
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Portal API",
        Version = "v1",
        Description = "Clean Architecture ASP.NET Core API secured by Microsoft Entra ID."
    });

    var bearerScheme = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        Description = "Paste a Microsoft Entra ID access token: Bearer {token}",
        Reference = new OpenApiReference
        {
            Type = ReferenceType.SecurityScheme,
            Id = "Bearer"
        }
    };

    options.AddSecurityDefinition("Bearer", bearerScheme);
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        [bearerScheme] = Array.Empty<string>()
    });
});

var app = builder.Build();

app.UseMiddleware<ExceptionHandlingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (app.Configuration.GetValue<bool>("Database:ApplyMigrationsOnStartup"))
{
    await app.Services.ApplyMigrationsAsync();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
