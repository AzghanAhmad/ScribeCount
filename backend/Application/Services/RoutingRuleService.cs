using AutoMapper;
using SCLinks.Application.DTOs;
using SCLinks.Application.Interfaces;
using SCLinks.Domain.Entities;

namespace SCLinks.Application.Services;

public class RoutingRuleService : IRoutingRuleService
{
    private readonly ISmartLinkRepository _smartLinkRepo;
    private readonly IRoutingRuleRepository _repo;
    private readonly IMapper _mapper;

    public RoutingRuleService(ISmartLinkRepository smartLinkRepo, IRoutingRuleRepository repo, IMapper mapper)
    {
        _smartLinkRepo = smartLinkRepo;
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<RoutingRuleResponseDto?> CreateAsync(Guid smartLinkId, Guid userId, RoutingRuleCreateDto dto, CancellationToken ct = default)
    {
        var link = await _smartLinkRepo.GetByIdAsync(smartLinkId, ct);
        if (link == null || link.UserId != userId) return null;

        if (!Enum.TryParse<RuleType>(dto.RuleType, true, out var ruleType))
            return null;

        var entity = new RoutingRule
        {
            Id = Guid.NewGuid(),
            SmartLinkId = smartLinkId,
            RuleType = ruleType,
            ConditionValue = dto.ConditionValue,
            TargetRetailerId = dto.TargetRetailerId,
            Priority = dto.Priority
        };
        await _repo.AddAsync(entity, ct);
        return _mapper.Map<RoutingRuleResponseDto>(entity);
    }

    public async Task<RoutingRuleResponseDto?> UpdateAsync(Guid id, Guid userId, RoutingRuleUpdateDto dto, CancellationToken ct = default)
    {
        var entity = await _repo.GetByIdAsync(id, ct);
        if (entity == null) return null;
        var link = await _smartLinkRepo.GetByIdAsync(entity.SmartLinkId, ct);
        if (link == null || link.UserId != userId) return null;

        if (dto.RuleType != null && Enum.TryParse<RuleType>(dto.RuleType, true, out var rt)) entity.RuleType = rt;
        if (dto.ConditionValue != null) entity.ConditionValue = dto.ConditionValue;
        if (dto.TargetRetailerId.HasValue) entity.TargetRetailerId = dto.TargetRetailerId;
        if (dto.Priority.HasValue) entity.Priority = dto.Priority.Value;

        await _repo.UpdateAsync(entity, ct);
        return _mapper.Map<RoutingRuleResponseDto>(entity);
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
