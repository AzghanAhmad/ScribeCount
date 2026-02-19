using Microsoft.Extensions.Logging;
using SCLinks.Application.Interfaces;
using SCLinks.Domain.Entities;

namespace SCLinks.Application.Routing;

public class RoutingEngineService : IRoutingEngineService
{
    private readonly ISmartLinkRepository _smartLinkRepo;
    private readonly ILogger<RoutingEngineService> _logger;

    public RoutingEngineService(ISmartLinkRepository smartLinkRepo, ILogger<RoutingEngineService> logger)
    {
        _smartLinkRepo = smartLinkRepo;
        _logger = logger;
    }

    public async Task<RoutingResult> ResolveDestinationAsync(string slug, RequestMetadata metadata, CancellationToken ct = default)
    {
        var link = await _smartLinkRepo.GetBySlugAsync(slug, ct);
        if (link == null)
            return new RoutingResult(false, null, null, "Smart link not found.");

        if (link.Status != SmartLinkStatus.Active)
            return new RoutingResult(false, null, null, "Link is not active.");

        var retailers = link.RetailerLinks.Where(r => r.IsAvailable).OrderBy(r => r.Priority).ToList();
        if (retailers.Count == 0)
            return new RoutingResult(false, null, null, "No available retailers.");

        // 1. Promotion active
        if (link.PromotionRedirect != null)
        {
            var now = DateTime.UtcNow;
            if (now >= link.PromotionRedirect.StartDate && now <= link.PromotionRedirect.EndDate)
                return new RoutingResult(true, link.PromotionRedirect.TemporaryUrl, "Promotion", null);
        }

        // 2. Pre-order switch logic (if release date passed, could switch to live URL - we don't have separate preorder/live URL on entity, so skip or use first retailer)
        // Optional: if IsPreOrder && ReleaseDate < now, could prefer a "live" retailer. For now we continue.

        // 3. Apply routing rules by priority
        var rules = link.RoutingRules.OrderBy(r => r.Priority).ToList();
        foreach (var rule in rules)
        {
            var match = MatchRule(rule, metadata, link);
            if (!match) continue;
            if (rule.TargetRetailerId.HasValue)
            {
                var target = retailers.FirstOrDefault(r => r.Id == rule.TargetRetailerId.Value);
                if (target != null)
                    return new RoutingResult(true, target.Url, target.RetailerName, null);
            }
        }

        // 4. Country fallback
        var country = metadata.Country?.Trim().ToUpperInvariant() ?? "";
        var byCountry = retailers.Where(r => r.CountryCode.Equals(country, StringComparison.OrdinalIgnoreCase)).ToList();
        if (byCountry.Count > 0)
            return new RoutingResult(true, byCountry[0].Url, byCountry[0].RetailerName, null);

        // 5. Format preference / default: first available retailer
        var fallback = retailers[0];
        return new RoutingResult(true, fallback.Url, fallback.RetailerName, null);
    }

    private static bool MatchRule(RoutingRule rule, RequestMetadata metadata, SmartLink link)
    {
        return rule.RuleType switch
        {
            RuleType.Country => metadata.Country?.Equals(rule.ConditionValue, StringComparison.OrdinalIgnoreCase) == true,
            RuleType.Device => metadata.DeviceType?.Equals(rule.ConditionValue, StringComparison.OrdinalIgnoreCase) == true,
            RuleType.Format => rule.ConditionValue.Length > 0, // could match query/header
            RuleType.Availability => true,
            _ => false
        };
    }
}
