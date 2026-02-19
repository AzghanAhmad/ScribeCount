using AutoMapper;
using SCLinks.Application.DTOs;
using SCLinks.Application.Interfaces;
using SCLinks.Domain.Entities;

namespace SCLinks.Application.Services;

public class PromotionService : IPromotionService
{
    private readonly ISmartLinkRepository _smartLinkRepo;
    private readonly IPromotionRedirectRepository _repo;
    private readonly IMapper _mapper;

    public PromotionService(ISmartLinkRepository smartLinkRepo, IPromotionRedirectRepository repo, IMapper mapper)
    {
        _smartLinkRepo = smartLinkRepo;
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<PromotionResponseDto?> CreateAsync(Guid smartLinkId, Guid userId, PromotionCreateDto dto, CancellationToken ct = default)
    {
        var link = await _smartLinkRepo.GetByIdAsync(smartLinkId, ct);
        if (link == null || link.UserId != userId) return null;
        if (await _repo.GetBySmartLinkIdAsync(smartLinkId, ct) != null)
            return null; // one promotion per link

        var entity = new PromotionRedirect
        {
            Id = Guid.NewGuid(),
            SmartLinkId = smartLinkId,
            TemporaryUrl = dto.TemporaryUrl,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate
        };
        await _repo.AddAsync(entity, ct);
        return _mapper.Map<PromotionResponseDto>(entity);
    }

    public async Task<PromotionResponseDto?> UpdateAsync(Guid id, Guid userId, PromotionUpdateDto dto, CancellationToken ct = default)
    {
        var existing = await _repo.GetByIdAsync(id, ct);
        if (existing == null) return null;
        var link = await _smartLinkRepo.GetByIdAsync(existing.SmartLinkId, ct);
        if (link == null || link.UserId != userId) return null;

        if (dto.TemporaryUrl != null) existing.TemporaryUrl = dto.TemporaryUrl;
        if (dto.StartDate.HasValue) existing.StartDate = dto.StartDate.Value;
        if (dto.EndDate.HasValue) existing.EndDate = dto.EndDate.Value;

        await _repo.UpdateAsync(existing, ct);
        return _mapper.Map<PromotionResponseDto>(existing);
    }

    public async Task<bool> DeleteAsync(Guid promotionId, Guid userId, CancellationToken ct = default)
    {
        var promo = await _repo.GetByIdAsync(promotionId, ct);
        if (promo == null) return false;
        var link = await _smartLinkRepo.GetByIdAsync(promo.SmartLinkId, ct);
        if (link == null || link.UserId != userId) return false;
        await _repo.DeleteAsync(promo, ct);
        return true;
    }
}
