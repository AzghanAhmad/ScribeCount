namespace SCLinks.Application.Routing;

public interface IRoutingEngineService
{
    /// <summary>
    /// Resolves the best destination URL for a slug given request metadata.
    /// Priority: promotion active → pre-order switch → routing rules by priority → retailer availability → country fallback → format preference → fallback retailer.
    /// </summary>
    Task<RoutingResult> ResolveDestinationAsync(string slug, RequestMetadata metadata, CancellationToken ct = default);
}

public record RoutingResult(bool Success, string? RedirectUrl, string? SelectedRetailerName, string? ErrorMessage);
