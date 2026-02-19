using AutoMapper;
using SCLinks.Application.DTOs;
using SCLinks.Application.Interfaces;
using SCLinks.Domain.Entities;

namespace SCLinks.Application.Services;

public class SmartLinkService : ISmartLinkService
{
    private readonly ISmartLinkRepository _repo;
    private readonly IMapper _mapper;

    public SmartLinkService(ISmartLinkRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<SmartLinkResponseDto?> CreateAsync(Guid userId, SmartLinkCreateDto dto, CancellationToken ct = default)
    {
        if (await _repo.SlugExistsAsync(dto.Slug, null, ct))
            return null;

        var entity = new SmartLink
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Slug = dto.Slug.Trim().ToLowerInvariant(),
            BookTitle = dto.BookTitle,
            CoverImageUrl = dto.CoverImageUrl,
            ReleaseDate = dto.ReleaseDate,
            IsPreOrder = dto.IsPreOrder,
            Status = SmartLinkStatus.Active,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        await _repo.AddAsync(entity, ct);
        var withDetails = await _repo.GetByIdWithDetailsAsync(entity.Id, ct);
        return withDetails == null ? _mapper.Map<SmartLinkResponseDto>(entity) : _mapper.Map<SmartLinkResponseDto>(withDetails);
    }

    public async Task<IReadOnlyList<SmartLinkResponseDto>> GetByUserAsync(Guid userId, CancellationToken ct = default)
    {
        var list = await _repo.GetByUserIdAsync(userId, ct);
        return _mapper.Map<List<SmartLinkResponseDto>>(list);
    }

    public async Task<SmartLinkResponseDto?> GetByIdAsync(Guid id, Guid userId, CancellationToken ct = default)
    {
        var entity = await _repo.GetByIdWithDetailsAsync(id, ct);
        if (entity == null || entity.UserId != userId) return null;
        return _mapper.Map<SmartLinkResponseDto>(entity);
    }

    public async Task<SmartLinkResponseDto?> UpdateAsync(Guid id, Guid userId, SmartLinkUpdateDto dto, CancellationToken ct = default)
    {
        var entity = await _repo.GetByIdAsync(id, ct);
        if (entity == null || entity.UserId != userId) return null;

        if (dto.BookTitle != null) entity.BookTitle = dto.BookTitle;
        if (dto.CoverImageUrl != null) entity.CoverImageUrl = dto.CoverImageUrl;
        if (dto.ReleaseDate.HasValue) entity.ReleaseDate = dto.ReleaseDate;
        if (dto.IsPreOrder.HasValue) entity.IsPreOrder = dto.IsPreOrder.Value;
        if (dto.Status != null && Enum.TryParse<SmartLinkStatus>(dto.Status, true, out var status))
            entity.Status = status;
        entity.UpdatedAt = DateTime.UtcNow;

        await _repo.UpdateAsync(entity, ct);
        var updated = await _repo.GetByIdWithDetailsAsync(id, ct);
        return updated == null ? null : _mapper.Map<SmartLinkResponseDto>(updated);
    }

    public async Task<bool> DeleteAsync(Guid id, Guid userId, CancellationToken ct = default)
    {
        var entity = await _repo.GetByIdAsync(id, ct);
        if (entity == null || entity.UserId != userId) return false;
        await _repo.DeleteAsync(entity, ct);
        return true;
    }
}
