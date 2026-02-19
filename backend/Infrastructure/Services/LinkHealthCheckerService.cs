using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using SCLinks.Application.Interfaces;
using SCLinks.Domain.Entities;
using SCLinks.Infrastructure.Persistence;

namespace SCLinks.Infrastructure.Services;

public class LinkHealthCheckerService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<LinkHealthCheckerService> _logger;
    private static readonly TimeSpan Interval = TimeSpan.FromHours(12);

    public LinkHealthCheckerService(IServiceScopeFactory scopeFactory, ILogger<LinkHealthCheckerService> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await CheckAllRetailerLinksAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during link health check.");
            }

            await Task.Delay(Interval, stoppingToken);
        }
    }

    private async Task CheckAllRetailerLinksAsync(CancellationToken ct)
    {
        using var scope = _scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var httpFactory = scope.ServiceProvider.GetRequiredService<IHttpClientFactory>();
        var logRepo = scope.ServiceProvider.GetRequiredService<IBrokenLinkLogRepository>();

        var retailers = await db.RetailerLinks.AsNoTracking().ToListAsync(ct);
        var client = httpFactory.CreateClient();
        client.Timeout = TimeSpan.FromSeconds(10);

        foreach (var r in retailers)
        {
            try
            {
                var request = new HttpRequestMessage(HttpMethod.Head, r.Url);
                var response = await client.SendAsync(request, ct);
                var status = response.IsSuccessStatusCode ? "healthy" : "warning";
                await logRepo.AddAsync(new BrokenLinkLog
                {
                    Id = Guid.NewGuid(),
                    RetailerLinkId = r.Id,
                    Status = status,
                    CheckedAt = DateTime.UtcNow
                }, ct);

                if (!response.IsSuccessStatusCode)
                {
                    var tracked = await db.RetailerLinks.FindAsync(new object[] { r.Id }, ct);
                    if (tracked != null)
                    {
                        tracked.IsAvailable = false;
                        await db.SaveChangesAsync(ct);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Health check failed for retailer {Retailer} {Url}", r.RetailerName, r.Url);
                await logRepo.AddAsync(new BrokenLinkLog
                {
                    Id = Guid.NewGuid(),
                    RetailerLinkId = r.Id,
                    Status = "down",
                    CheckedAt = DateTime.UtcNow
                }, ct);
                var tracked = await db.RetailerLinks.FindAsync(new object[] { r.Id }, ct);
                if (tracked != null)
                {
                    tracked.IsAvailable = false;
                    await db.SaveChangesAsync(ct);
                }
            }
        }
    }
}
