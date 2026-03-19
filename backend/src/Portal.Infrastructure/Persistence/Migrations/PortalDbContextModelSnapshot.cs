using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Portal.Infrastructure.Persistence;

#nullable disable

namespace Portal.Infrastructure.Persistence.Migrations;

[DbContext(typeof(PortalDbContext))]
partial class PortalDbContextModelSnapshot : ModelSnapshot
{
    protected override void BuildModel(ModelBuilder modelBuilder)
    {
#pragma warning disable 612, 618
        modelBuilder
            .HasAnnotation("ProductVersion", "8.0.10")
            .HasAnnotation("Relational:MaxIdentifierLength", 128);

        SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

        modelBuilder.Entity("Portal.Domain.Entities.Project", entity =>
        {
            entity.Property<Guid>("Id")
                .ValueGeneratedNever()
                .HasColumnType("uniqueidentifier");

            entity.Property<DateTimeOffset>("CreatedUtc")
                .HasColumnType("datetimeoffset");

            entity.Property<string>("Description")
                .IsRequired()
                .HasMaxLength(1000)
                .HasColumnType("nvarchar(1000)");

            entity.Property<string>("Name")
                .IsRequired()
                .HasMaxLength(120)
                .HasColumnType("nvarchar(120)");

            entity.Property<string>("Status")
                .IsRequired()
                .HasMaxLength(40)
                .HasColumnType("nvarchar(40)");

            entity.Property<DateTimeOffset?>("UpdatedUtc")
                .HasColumnType("datetimeoffset");

            entity.HasKey("Id");

            entity.ToTable("Projects");

            entity.HasData(
                new
                {
                    Id = new Guid("6bf8a420-1d41-4d13-8d64-0e52828a4b11"),
                    CreatedUtc = new DateTimeOffset(new DateTime(2026, 1, 15, 0, 0, 0, DateTimeKind.Unspecified), TimeSpan.Zero),
                    Description = "Seeded demo project for validating the secured API and frontend integration.",
                    Name = "Azure Portal Foundation",
                    Status = "Active"
                },
                new
                {
                    Id = new Guid("fb46a24e-17a5-41a3-9186-3774ab6a6022"),
                    CreatedUtc = new DateTimeOffset(new DateTime(2026, 1, 15, 0, 0, 0, DateTimeKind.Unspecified), TimeSpan.Zero),
                    Description = "Sample project used to test role-based UI rendering and authenticated requests.",
                    Name = "Identity Rollout",
                    Status = "Planned"
                });
        });
#pragma warning restore 612, 618
    }
}
