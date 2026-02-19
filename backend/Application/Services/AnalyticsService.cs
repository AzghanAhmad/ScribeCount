using SCLinks.Application.DTOs;
using SCLinks.Application.Interfaces;

namespace SCLinks.Application.Services;

public class AnalyticsService : IAnalyticsService
{
    private readonly ISmartLinkRepository _smartLinkRepo;
    private readonly IClickEventRepository _clickRepo;

    public AnalyticsService(ISmartLinkRepository smartLinkRepo, IClickEventRepository clickRepo)
    {
        _smartLinkRepo = smartLinkRepo;
        _clickRepo = clickRepo;
    }

    public async Task<AnalyticsSummaryDto?> GetSummaryAsync(Guid smartLinkId, Guid userId, DateTime? from, DateTime? to, CancellationToken ct = default)
    {
        var link = await _smartLinkRepo.GetByIdAsync(smartLinkId, ct);
        if (link == null || link.UserId != userId) return null;
        var events = await _clickRepo.GetBySmartLinkIdAsync(smartLinkId, from, to, ct);
        return new AnalyticsSummaryDto(smartLinkId, events.Count, from, to);
    }

    public async Task<IReadOnlyList<AnalyticsByCountryDto>> GetByCountryAsync(Guid smartLinkId, Guid userId, DateTime? from, DateTime? to, CancellationToken ct = default)
    {
        var link = await _smartLinkRepo.GetByIdAsync(smartLinkId, ct);
        if (link == null || link.UserId != userId) return Array.Empty<AnalyticsByCountryDto>();
        var events = await _clickRepo.GetBySmartLinkIdAsync(smartLinkId, from, to, ct);
        var total = events.Count;
        if (total == 0) return Array.Empty<AnalyticsByCountryDto>();
        var byCountry = events.GroupBy(x => x.Country ?? "Unknown").Select(g => new AnalyticsByCountryDto(g.Key, g.Count(), Math.Round(100.0 * g.Count() / total, 2))).OrderByDescending(x => x.Clicks).ToList();
        return byCountry;
    }

    public async Task<IReadOnlyList<AnalyticsByDeviceDto>> GetByDeviceAsync(Guid smartLinkId, Guid userId, DateTime? from, DateTime? to, CancellationToken ct = default)
    {
        var link = await _smartLinkRepo.GetByIdAsync(smartLinkId, ct);
        if (link == null || link.UserId != userId) return Array.Empty<AnalyticsByDeviceDto>();
        var events = await _clickRepo.GetBySmartLinkIdAsync(smartLinkId, from, to, ct);
        var total = events.Count;
        if (total == 0) return Array.Empty<AnalyticsByDeviceDto>();
        var byDevice = events.GroupBy(x => x.DeviceType ?? "Unknown").Select(g => new AnalyticsByDeviceDto(g.Key, g.Count(), Math.Round(100.0 * g.Count() / total, 2))).OrderByDescending(x => x.Clicks).ToList();
        return byDevice;
    }

    public async Task<IReadOnlyList<AnalyticsByRetailerDto>> GetByRetailerAsync(Guid smartLinkId, Guid userId, DateTime? from, DateTime? to, CancellationToken ct = default)
    {
        var link = await _smartLinkRepo.GetByIdAsync(smartLinkId, ct);
        if (link == null || link.UserId != userId) return Array.Empty<AnalyticsByRetailerDto>();
        var events = await _clickRepo.GetBySmartLinkIdAsync(smartLinkId, from, to, ct);
        var total = events.Count;
        if (total == 0) return Array.Empty<AnalyticsByRetailerDto>();
        var byRetailer = events.GroupBy(x => x.SelectedRetailer ?? "Unknown").Select(g => new AnalyticsByRetailerDto(g.Key, g.Count(), Math.Round(100.0 * g.Count() / total, 2))).OrderByDescending(x => x.Clicks).ToList();
        return byRetailer;
    }
}
