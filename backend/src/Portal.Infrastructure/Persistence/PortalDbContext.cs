using Microsoft.EntityFrameworkCore;
using Portal.Domain.Entities;
using Portal.Infrastructure.Persistence.Configurations;

namespace Portal.Infrastructure.Persistence;

public class PortalDbContext : DbContext
{
    public PortalDbContext(DbContextOptions<PortalDbContext> options) : base(options)
    {
    }

    public DbSet<Project> Projects => Set<Project>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new ProjectConfiguration());
    }
}
