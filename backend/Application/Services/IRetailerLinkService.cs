using SCLinks.Application.DTOs;

namespace SCLinks.Application.Services;

public interface IRetailerLinkService
{
    Task<RetailerResponseDto?> CreateAsync(Guid smartLinkId, Guid userId, RetailerCreateDto dto, CancellationToken ct = default);
    Task<RetailerResponseDto?> UpdateAsync(Guid id, Guid userId, RetailerUpdateDto dto, CancellationToken ct = default);
    Task<bool> DeleteAsync(Guid id, Guid userId, CancellationToken ct = default);
}
