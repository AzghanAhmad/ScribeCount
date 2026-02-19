using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace SCLinks.Infrastructure.Persistence;

public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var basePath = Path.Combine(Directory.GetCurrentDirectory(), "..", "API");
        var config = new ConfigurationBuilder()
            .SetBasePath(basePath)
            .AddJsonFile("appsettings.json", optional: false)
            .Build();

        var conn = config.GetConnectionString("DefaultConnection")
            ?? "Server=localhost;Port=3306;Database=sc_links;User=root;Password=;";

        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseMySql(conn, ServerVersion.AutoDetect(conn))
            .Options;

        return new AppDbContext(options);
    }
}
