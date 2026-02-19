using SCLinks.Application.DTOs;

namespace SCLinks.Application.Services;

public interface IRoutingRuleService
{
    Task<RoutingRuleResponseDto?> CreateAsync(Guid smartLinkId, Guid userId, RoutingRuleCreateDto dto, CancellationToken ct = default);
    Task<RoutingRuleResponseDto?> UpdateAsync(Guid id, Guid userId, RoutingRuleUpdateDto dto, CancellationToken ct = default);
    Task<bool> DeleteAsync(Guid id, Guid userId, CancellationToken ct = default);
}
