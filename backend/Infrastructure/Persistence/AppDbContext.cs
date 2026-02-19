using Microsoft.EntityFrameworkCore;
using SCLinks.Domain.Entities;

namespace SCLinks.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<SmartLink> SmartLinks => Set<SmartLink>();
    public DbSet<RetailerLink> RetailerLinks => Set<RetailerLink>();
    public DbSet<RoutingRule> RoutingRules => Set<RoutingRule>();
    public DbSet<ClickEvent> ClickEvents => Set<ClickEvent>();
    public DbSet<PromotionRedirect> PromotionRedirects => Set<PromotionRedirect>();
    public DbSet<BrokenLinkLog> BrokenLinkLogs => Set<BrokenLinkLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasIndex(x => x.Email).IsUnique();
        });

        modelBuilder.Entity<SmartLink>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasIndex(x => x.Slug).IsUnique();
            e.HasIndex(x => x.UserId);
            e.HasOne(x => x.User).WithMany(u => u.SmartLinks).HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<RetailerLink>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasIndex(x => x.SmartLinkId);
            e.HasOne(x => x.SmartLink).WithMany(s => s.RetailerLinks).HasForeignKey(x => x.SmartLinkId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<RoutingRule>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasIndex(x => x.SmartLinkId);
            e.HasOne(x => x.SmartLink).WithMany(s => s.RoutingRules).HasForeignKey(x => x.SmartLinkId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ClickEvent>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasIndex(x => x.SmartLinkId);
            e.HasIndex(x => x.Country);
            e.HasOne(x => x.SmartLink).WithMany(s => s.ClickEvents).HasForeignKey(x => x.SmartLinkId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<PromotionRedirect>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasOne(x => x.SmartLink).WithOne(s => s.PromotionRedirect).HasForeignKey<PromotionRedirect>(x => x.SmartLinkId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<BrokenLinkLog>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasOne(x => x.RetailerLink).WithMany(r => r.BrokenLinkLogs).HasForeignKey(x => x.RetailerLinkId).OnDelete(DeleteBehavior.Cascade);
        });
    }
}
