using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Portal.Infrastructure.Persistence.Migrations;

public partial class InitialCreate : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "Projects",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                Name = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                Status = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: false),
                CreatedUtc = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                UpdatedUtc = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Projects", x => x.Id);
            });

        migrationBuilder.InsertData(
            table: "Projects",
            columns: new[] { "Id", "CreatedUtc", "Description", "Name", "Status", "UpdatedUtc" },
            values: new object[,]
            {
                {
                    new Guid("6bf8a420-1d41-4d13-8d64-0e52828a4b11"),
                    new DateTimeOffset(new DateTime(2026, 1, 15, 0, 0, 0, DateTimeKind.Unspecified), TimeSpan.Zero),
                    "Seeded demo project for validating the secured API and frontend integration.",
                    "Azure Portal Foundation",
                    "Active",
                    null
                },
                {
                    new Guid("fb46a24e-17a5-41a3-9186-3774ab6a6022"),
                    new DateTimeOffset(new DateTime(2026, 1, 15, 0, 0, 0, DateTimeKind.Unspecified), TimeSpan.Zero),
                    "Sample project used to test role-based UI rendering and authenticated requests.",
                    "Identity Rollout",
                    "Planned",
                    null
                }
            });
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(
            name: "Projects");
    }
}
