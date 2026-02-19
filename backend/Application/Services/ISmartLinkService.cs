using SCLinks.Application.DTOs;

namespace SCLinks.Application.Services;

public interface ISmartLinkService
{
    Task<SmartLinkResponseDto?> CreateAsync(Guid userId, SmartLinkCreateDto dto, CancellationToken ct = default);
    Task<IReadOnlyList<SmartLinkResponseDto>> GetByUserAsync(Guid userId, CancellationToken ct = default);
    Task<SmartLinkResponseDto?> GetByIdAsync(Guid id, Guid userId, CancellationToken ct = default);
    Task<SmartLinkResponseDto?> UpdateAsync(Guid id, Guid userId, SmartLinkUpdateDto dto, CancellationToken ct = default);
    Task<bool> DeleteAsync(Guid id, Guid userId, CancellationToken ct = default);
}
