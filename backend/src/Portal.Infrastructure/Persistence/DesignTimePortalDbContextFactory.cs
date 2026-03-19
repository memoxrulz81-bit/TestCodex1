using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Portal.Infrastructure.Persistence;

public class DesignTimePortalDbContextFactory : IDesignTimeDbContextFactory<PortalDbContext>
{
    public PortalDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<PortalDbContext>();
        var connectionString =
            Environment.GetEnvironmentVariable("PORTAL_SQL_CONNECTION_STRING") ??
            "Server=tcp:your-sql-server.database.windows.net,1433;Initial Catalog=PortalDb;Persist Security Info=False;User ID=sql-admin-user;Password=ReplaceMe123!;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;";

        optionsBuilder.UseSqlServer(connectionString);

        return new PortalDbContext(optionsBuilder.Options);
    }
}
