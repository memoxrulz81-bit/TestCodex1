using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Portal.Application.Interfaces.Persistence;
using Portal.Infrastructure.Persistence;
using Portal.Infrastructure.Repositories;

namespace Portal.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("SqlDatabase")
            ?? throw new InvalidOperationException("Connection string 'SqlDatabase' is not configured.");

        services.AddDbContext<PortalDbContext>(options =>
            options.UseSqlServer(connectionString, sqlOptions =>
                sqlOptions.MigrationsAssembly(typeof(PortalDbContext).Assembly.FullName)));

        services.AddScoped<IProjectRepository, ProjectRepository>();

        return services;
    }

    public static async Task ApplyMigrationsAsync(this IServiceProvider services, CancellationToken cancellationToken = default)
    {
        using var scope = services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<PortalDbContext>();
        await dbContext.Database.MigrateAsync(cancellationToken);
    }
}
