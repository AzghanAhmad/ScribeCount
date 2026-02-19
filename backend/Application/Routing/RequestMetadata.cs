namespace SCLinks.Application.Routing;

public record RequestMetadata(
    string? Country,
    string? DeviceType,
    string? UserAgent,
    string? PlatformSource,
    string? CampaignName
);
