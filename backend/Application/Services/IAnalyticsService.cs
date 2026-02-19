using SCLinks.Application.DTOs;

namespace SCLinks.Application.Services;

public interface IAnalyticsService
{
    Task<AnalyticsSummaryDto?> GetSummaryAsync(Guid smartLinkId, Guid userId, DateTime? from, DateTime? to, CancellationToken ct = default);
    Task<IReadOnlyList<AnalyticsByCountryDto>> GetByCountryAsync(Guid smartLinkId, Guid userId, DateTime? from, DateTime? to, CancellationToken ct = default);
    Task<IReadOnlyList<AnalyticsByDeviceDto>> GetByDeviceAsync(Guid smartLinkId, Guid userId, DateTime? from, DateTime? to, CancellationToken ct = default);
    Task<IReadOnlyList<AnalyticsByRetailerDto>> GetByRetailerAsync(Guid smartLinkId, Guid userId, DateTime? from, DateTime? to, CancellationToken ct = default);
}
