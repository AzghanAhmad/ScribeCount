using AutoMapper;
using SCLinks.Application.DTOs;
using SCLinks.Application.Interfaces;
using SCLinks.Domain.Entities;

namespace SCLinks.Application.Services;

public class RetailerLinkService : IRetailerLinkService
{
    private readonly ISmartLinkRepository _smartLinkRepo;
    private readonly IRetailerLinkRepository _repo;
    private readonly IMapper _mapper;

    public RetailerLinkService(ISmartLinkRepository smartLinkRepo, IRetailerLinkRepository repo, IMapper mapper)
    {
        _smartLinkRepo = smartLinkRepo;
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<RetailerResponseDto?> CreateAsync(Guid smartLinkId, Guid userId, RetailerCreateDto dto, CancellationToken ct = default)
    {
        var link = await _smartLinkRepo.GetByIdAsync(smartLinkId, ct);
        if (link == null || link.UserId != userId) return null;

        var entity = new RetailerLink
        {
            Id = Guid.NewGuid(),
            SmartLinkId = smartLinkId,
            RetailerName = dto.RetailerName,
            CountryCode = dto.CountryCode,
            Url = dto.Url,
            IsAvailable = dto.IsAvailable,
            Priority = dto.Priority
        };
        await _repo.AddAsync(entity, ct);
        return _mapper.Map<RetailerResponseDto>(entity);
    }

    public async Task<RetailerResponseDto?> UpdateAsync(Guid id, Guid userId, RetailerUpdateDto dto, CancellationToken ct = default)
    {
        var entity = await _repo.GetByIdAsync(id, ct);
        if (entity == null) return null;
        var link = await _smartLinkRepo.GetByIdAsync(entity.SmartLinkId, ct);
        if (link == null || link.UserId != userId) return null;

        if (dto.RetailerName != null) entity.RetailerName = dto.RetailerName;
        if (dto.CountryCode != null) entity.CountryCode = dto.CountryCode;
        if (dto.Url != null) entity.Url = dto.Url;
        if (dto.IsAvailable.HasValue) entity.IsAvailable = dto.IsAvailable.Value;
        if (dto.Priority.HasValue) entity.Priority = dto.Priority.Value;

        await _repo.UpdateAsync(entity, ct);
        return _mapper.Map<RetailerResponseDto>(entity);
    }

    public async Task<bool> DeleteAsync(Guid id, Guid userId, CancellationToken ct = default)
    {
        var entity = await _repo.GetByIdAsync(id, ct);
        if (entity == null) return false;
        var link = await _smartLinkRepo.GetByIdAsync(entity.SmartLinkId, ct);
        if (link == null || link.UserId != userId) return false;
        await _repo.DeleteAsync(entity, ct);
        return true;
    }
}
