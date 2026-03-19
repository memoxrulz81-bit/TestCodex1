using Microsoft.Extensions.DependencyInjection;
using Portal.Application.Interfaces.Services;
using Portal.Application.Services;

namespace Portal.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddAutoMapper(_ => { }, typeof(DependencyInjection).Assembly);
        services.AddScoped<IProjectService, ProjectService>();

        return services;
    }
}
