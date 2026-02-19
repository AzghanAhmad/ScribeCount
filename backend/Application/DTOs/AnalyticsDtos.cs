namespace SCLinks.Application.DTOs;

public record AnalyticsSummaryDto(
    Guid SmartLinkId,
    int TotalClicks,
    DateTime? From,
    DateTime? To
);

public record AnalyticsByCountryDto(string Country, int Clicks, double Percentage);
public record AnalyticsByDeviceDto(string DeviceType, int Clicks, double Percentage);
public record AnalyticsByRetailerDto(string Retailer, int Clicks, double Percentage);
