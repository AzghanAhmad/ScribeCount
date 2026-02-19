using SCLinks.Application.DTOs;

namespace SCLinks.Application.Services;

public interface IPromotionService
{
    Task<PromotionResponseDto?> CreateAsync(Guid smartLinkId, Guid userId, PromotionCreateDto dto, CancellationToken ct = default);
    Task<PromotionResponseDto?> UpdateAsync(Guid id, Guid userId, PromotionUpdateDto dto, CancellationToken ct = default);
    Task<bool> DeleteAsync(Guid smartLinkId, Guid userId, CancellationToken ct = default);
}
