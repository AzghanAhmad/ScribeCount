using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SCLinks.Application.Interfaces;
using SCLinks.Application.Routing;
using SCLinks.Domain.Entities;

namespace SCLinks.API.Controllers;

[ApiController]
[AllowAnonymous]
public class RedirectController : ControllerBase
{
    private readonly IRoutingEngineService _routingEngine;
    private readonly IClickEventRepository _clickRepo;
    private readonly ISmartLinkRepository _smartLinkRepo;

    public RedirectController(IRoutingEngineService routingEngine, IClickEventRepository clickRepo, ISmartLinkRepository smartLinkRepo)
    {
        _routingEngine = routingEngine;
        _clickRepo = clickRepo;
        _smartLinkRepo = smartLinkRepo;
    }

    [HttpGet("r/{slug}")]
    public async Task<IActionResult> Redirect([FromRoute] string slug, [FromHeader(Name = "X-Country")] string? country, [FromHeader(Name = "User-Agent")] string? userAgent, CancellationToken ct)
    {
        var metadata = new RequestMetadata(
            Country: country ?? Request.Headers["CF-IPCountry"].FirstOrDefault(),
            DeviceType: ParseDeviceType(userAgent),
            UserAgent: userAgent,
            PlatformSource: null,
            CampaignName: Request.Query["utm_source"].FirstOrDefault()
        );

        var result = await _routingEngine.ResolveDestinationAsync(slug, metadata, ct);
        if (!result.Success || string.IsNullOrEmpty(result.RedirectUrl))
            return NotFound(new { error = result.ErrorMessage ?? "Link not found or not active." });

        var link = await _smartLinkRepo.GetBySlugAsync(slug, ct);
        if (link != null)
        {
            await _clickRepo.AddAsync(new ClickEvent
            {
                Id = Guid.NewGuid(),
                SmartLinkId = link.Id,
                Country = metadata.Country,
                DeviceType = metadata.DeviceType,
                PlatformSource = metadata.PlatformSource,
                CampaignName = metadata.CampaignName,
                SelectedRetailer = result.SelectedRetailerName,
                ClickedAt = DateTime.UtcNow
            }, ct);
        }

        return Redirect(result.RedirectUrl);
    }

    private static string? ParseDeviceType(string? userAgent)
    {
        if (string.IsNullOrEmpty(userAgent)) return null;
        var ua = userAgent.ToLowerInvariant();
        if (ua.Contains("mobile") && !ua.Contains("ipad")) return "mobile";
        if (ua.Contains("tablet") || ua.Contains("ipad")) return "tablet";
        return "desktop";
    }
}
