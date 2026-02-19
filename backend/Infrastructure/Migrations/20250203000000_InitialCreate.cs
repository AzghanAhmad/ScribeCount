using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SCLinks.Infrastructure.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Name = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Email = table.Column<string>(type: "varchar(256)", maxLength: 256, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PasswordHash = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table => table.PrimaryKey("PK_Users", x => x.Id))
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "SmartLinks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    UserId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Slug = table.Column<string>(type: "varchar(64)", maxLength: 64, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    BookTitle = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CoverImageUrl = table.Column<string>(type: "varchar(2000)", maxLength: 2000, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ReleaseDate = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    IsPreOrder = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SmartLinks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SmartLinks_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ClickEvents",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    SmartLinkId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Country = table.Column<string>(type: "varchar(10)", maxLength: 10, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DeviceType = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PlatformSource = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CampaignName = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SelectedRetailer = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ClickedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClickEvents", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ClickEvents_SmartLinks_SmartLinkId",
                        column: x => x.SmartLinkId,
                        principalTable: "SmartLinks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "PromotionRedirects",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    SmartLinkId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    TemporaryUrl = table.Column<string>(type: "varchar(2000)", maxLength: 2000, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    StartDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PromotionRedirects", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PromotionRedirects_SmartLinks_SmartLinkId",
                        column: x => x.SmartLinkId,
                        principalTable: "SmartLinks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "RetailerLinks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    SmartLinkId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    RetailerName = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CountryCode = table.Column<string>(type: "varchar(2)", maxLength: 2, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Url = table.Column<string>(type: "varchar(2000)", maxLength: 2000, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsAvailable = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    Priority = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RetailerLinks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RetailerLinks_SmartLinks_SmartLinkId",
                        column: x => x.SmartLinkId,
                        principalTable: "SmartLinks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "RoutingRules",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    SmartLinkId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    RuleType = table.Column<int>(type: "int", nullable: false),
                    ConditionValue = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    TargetRetailerId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    Priority = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoutingRules", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RoutingRules_SmartLinks_SmartLinkId",
                        column: x => x.SmartLinkId,
                        principalTable: "SmartLinks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "BrokenLinkLogs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    RetailerLinkId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Status = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CheckedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BrokenLinkLogs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BrokenLinkLogs_RetailerLinks_RetailerLinkId",
                        column: x => x.RetailerLinkId,
                        principalTable: "RetailerLinks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_ClickEvents_Country",
                table: "ClickEvents",
                column: "Country");

            migrationBuilder.CreateIndex(
                name: "IX_ClickEvents_SmartLinkId",
                table: "ClickEvents",
                column: "SmartLinkId");

            migrationBuilder.CreateIndex(
                name: "IX_PromotionRedirects_SmartLinkId",
                table: "PromotionRedirects",
                column: "SmartLinkId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RetailerLinks_SmartLinkId",
                table: "RetailerLinks",
                column: "SmartLinkId");

            migrationBuilder.CreateIndex(
                name: "IX_RoutingRules_SmartLinkId",
                table: "RoutingRules",
                column: "SmartLinkId");

            migrationBuilder.CreateIndex(
                name: "IX_SmartLinks_Slug",
                table: "SmartLinks",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SmartLinks_UserId",
                table: "SmartLinks",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "BrokenLinkLogs");
            migrationBuilder.DropTable(name: "ClickEvents");
            migrationBuilder.DropTable(name: "PromotionRedirects");
            migrationBuilder.DropTable(name: "RetailerLinks");
            migrationBuilder.DropTable(name: "RoutingRules");
            migrationBuilder.DropTable(name: "SmartLinks");
            migrationBuilder.DropTable(name: "Users");
        }
    }
}
