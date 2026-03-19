using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Portal.Domain.Entities;

namespace Portal.Infrastructure.Persistence.Configurations;

public class ProjectConfiguration : IEntityTypeConfiguration<Project>
{
    public static readonly Guid SeedProjectAlphaId = Guid.Parse("6BF8A420-1D41-4D13-8D64-0E52828A4B11");
    public static readonly Guid SeedProjectBetaId = Guid.Parse("FB46A24E-17A5-41A3-9186-3774AB6A6022");
    private static readonly DateTimeOffset SeededAt = new(2026, 1, 15, 0, 0, 0, TimeSpan.Zero);

    public void Configure(EntityTypeBuilder<Project> builder)
    {
        builder.ToTable("Projects");

        builder.HasKey(project => project.Id);

        builder.Property(project => project.Name)
            .HasMaxLength(120)
            .IsRequired();

        builder.Property(project => project.Description)
            .HasMaxLength(1000)
            .IsRequired();

        builder.Property(project => project.Status)
            .HasMaxLength(40)
            .IsRequired();

        builder.HasData(
            new Project
            {
                Id = SeedProjectAlphaId,
                Name = "Azure Portal Foundation",
                Description = "Seeded demo project for validating the secured API and frontend integration.",
                Status = "Active",
                CreatedUtc = SeededAt
            },
            new Project
            {
                Id = SeedProjectBetaId,
                Name = "Identity Rollout",
                Description = "Sample project used to test role-based UI rendering and authenticated requests.",
                Status = "Planned",
                CreatedUtc = SeededAt
            });
    }
}
