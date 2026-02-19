using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using SCLinks.Infrastructure.Persistence;

#nullable disable

namespace SCLinks.Infrastructure.Migrations
{
    [DbContext(typeof(AppDbContext))]
    partial class AppDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("MySql:CharSet", "utf8mb4")
                .HasAnnotation("ProductVersion", "8.0.10");

            modelBuilder.Entity("SCLinks.Domain.Entities.User", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(256)
                        .HasColumnType("varchar(256)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("varchar(200)");

                    b.Property<string>("PasswordHash")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.HasIndex("Email")
                        .IsUnique();

                    b.ToTable("Users");
                });

            modelBuilder.Entity("SCLinks.Domain.Entities.SmartLink", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<string>("BookTitle")
                        .IsRequired()
                        .HasMaxLength(500)
                        .HasColumnType("varchar(500)");

                    b.Property<string>("CoverImageUrl")
                        .HasMaxLength(2000)
                        .HasColumnType("varchar(2000)");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime(6)");

                    b.Property<bool>("IsPreOrder")
                        .HasColumnType("tinyint(1)");

                    b.Property<DateTime?>("ReleaseDate")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Slug")
                        .IsRequired()
                        .HasMaxLength(64)
                        .HasColumnType("varchar(64)");

                    b.Property<int>("Status")
                        .HasColumnType("int");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime(6)");

                    b.Property<Guid>("UserId")
                        .HasColumnType("char(36)");

                    b.HasKey("Id");

                    b.HasIndex("Slug")
                        .IsUnique();

                    b.HasIndex("UserId");

                    b.ToTable("SmartLinks");
                });

            modelBuilder.Entity("SCLinks.Domain.Entities.RetailerLink", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<string>("CountryCode")
                        .IsRequired()
                        .HasMaxLength(2)
                        .HasColumnType("varchar(2)");

                    b.Property<bool>("IsAvailable")
                        .HasColumnType("tinyint(1)");

                    b.Property<int>("Priority")
                        .HasColumnType("int");

                    b.Property<string>("RetailerName")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("varchar(200)");

                    b.Property<Guid>("SmartLinkId")
                        .HasColumnType("char(36)");

                    b.Property<string>("Url")
                        .IsRequired()
                        .HasMaxLength(2000)
                        .HasColumnType("varchar(2000)");

                    b.HasKey("Id");

                    b.HasIndex("SmartLinkId");

                    b.ToTable("RetailerLinks");
                });

            modelBuilder.Entity("SCLinks.Domain.Entities.RoutingRule", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<string>("ConditionValue")
                        .IsRequired()
                        .HasMaxLength(500)
                        .HasColumnType("varchar(500)");

                    b.Property<int>("Priority")
                        .HasColumnType("int");

                    b.Property<int>("RuleType")
                        .HasColumnType("int");

                    b.Property<Guid>("SmartLinkId")
                        .HasColumnType("char(36)");

                    b.Property<Guid?>("TargetRetailerId")
                        .HasColumnType("char(36)");

                    b.HasKey("Id");

                    b.HasIndex("SmartLinkId");

                    b.ToTable("RoutingRules");
                });

            modelBuilder.Entity("SCLinks.Domain.Entities.ClickEvent", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<DateTime>("ClickedAt")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("CampaignName")
                        .HasMaxLength(200)
                        .HasColumnType("varchar(200)");

                    b.Property<string>("Country")
                        .HasMaxLength(10)
                        .HasColumnType("varchar(10)");

                    b.Property<string>("DeviceType")
                        .HasMaxLength(50)
                        .HasColumnType("varchar(50)");

                    b.Property<string>("PlatformSource")
                        .HasMaxLength(100)
                        .HasColumnType("varchar(100)");

                    b.Property<string>("SelectedRetailer")
                        .HasMaxLength(200)
                        .HasColumnType("varchar(200)");

                    b.Property<Guid>("SmartLinkId")
                        .HasColumnType("char(36)");

                    b.HasKey("Id");

                    b.HasIndex("Country");

                    b.HasIndex("SmartLinkId");

                    b.ToTable("ClickEvents");
                });

            modelBuilder.Entity("SCLinks.Domain.Entities.PromotionRedirect", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<DateTime>("EndDate")
                        .HasColumnType("datetime(6)");

                    b.Property<DateTime>("StartDate")
                        .HasColumnType("datetime(6)");

                    b.Property<Guid>("SmartLinkId")
                        .HasColumnType("char(36)");

                    b.Property<string>("TemporaryUrl")
                        .IsRequired()
                        .HasMaxLength(2000)
                        .HasColumnType("varchar(2000)");

                    b.HasKey("Id");

                    b.HasIndex("SmartLinkId")
                        .IsUnique();

                    b.ToTable("PromotionRedirects");
                });

            modelBuilder.Entity("SCLinks.Domain.Entities.BrokenLinkLog", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<DateTime>("CheckedAt")
                        .HasColumnType("datetime(6)");

                    b.Property<Guid>("RetailerLinkId")
                        .HasColumnType("char(36)");

                    b.Property<string>("Status")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("varchar(50)");

                    b.HasKey("Id");

                    b.HasIndex("RetailerLinkId");

                    b.ToTable("BrokenLinkLogs");
                });

            modelBuilder.Entity("SCLinks.Domain.Entities.SmartLink", b =>
                {
                    b.HasOne("SCLinks.Domain.Entities.User", "User")
                        .WithMany("SmartLinks")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("SCLinks.Domain.Entities.RetailerLink", b =>
                {
                    b.HasOne("SCLinks.Domain.Entities.SmartLink", "SmartLink")
                        .WithMany("RetailerLinks")
                        .HasForeignKey("SmartLinkId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("SmartLink");
                });

            modelBuilder.Entity("SCLinks.Domain.Entities.RoutingRule", b =>
                {
                    b.HasOne("SCLinks.Domain.Entities.SmartLink", "SmartLink")
                        .WithMany("RoutingRules")
                        .HasForeignKey("SmartLinkId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("SmartLink");
                });

            modelBuilder.Entity("SCLinks.Domain.Entities.ClickEvent", b =>
                {
                    b.HasOne("SCLinks.Domain.Entities.SmartLink", "SmartLink")
                        .WithMany("ClickEvents")
                        .HasForeignKey("SmartLinkId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("SmartLink");
                });

            modelBuilder.Entity("SCLinks.Domain.Entities.PromotionRedirect", b =>
                {
                    b.HasOne("SCLinks.Domain.Entities.SmartLink", "SmartLink")
                        .WithOne("PromotionRedirect")
                        .HasForeignKey("SCLinks.Domain.Entities.PromotionRedirect", "SmartLinkId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("SmartLink");
                });

            modelBuilder.Entity("SCLinks.Domain.Entities.BrokenLinkLog", b =>
                {
                    b.HasOne("SCLinks.Domain.Entities.RetailerLink", "RetailerLink")
                        .WithMany("BrokenLinkLogs")
                        .HasForeignKey("RetailerLinkId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("RetailerLink");
                });

            modelBuilder.Entity("SCLinks.Domain.Entities.User", b =>
                {
                    b.Navigation("SmartLinks");
                });

            modelBuilder.Entity("SCLinks.Domain.Entities.SmartLink", b =>
                {
                    b.Navigation("ClickEvents");
                    b.Navigation("PromotionRedirect");
                    b.Navigation("RetailerLinks");
                    b.Navigation("RoutingRules");
                });

            modelBuilder.Entity("SCLinks.Domain.Entities.RetailerLink", b =>
                {
                    b.Navigation("BrokenLinkLogs");
                });
#pragma warning restore 612, 618
        }
    }
}
