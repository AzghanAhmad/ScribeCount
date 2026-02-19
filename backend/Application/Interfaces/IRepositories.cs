using SCLinks.Domain.Entities;

namespace SCLinks.Application.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<User?> GetByEmailAsync(string email, CancellationToken ct = default);
    Task<User> AddAsync(User entity, CancellationToken ct = default);
    Task UpdateAsync(User entity, CancellationToken ct = default);
}

public interface ISmartLinkRepository
{
    Task<SmartLink?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<SmartLink?> GetBySlugAsync(string slug, CancellationToken ct = default);
    Task<SmartLink?> GetByIdWithDetailsAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<SmartLink>> GetByUserIdAsync(Guid userId, CancellationToken ct = default);
    Task<bool> SlugExistsAsync(string slug, Guid? excludeId = null, CancellationToken ct = default);
    Task<SmartLink> AddAsync(SmartLink entity, CancellationToken ct = default);
    Task UpdateAsync(SmartLink entity, CancellationToken ct = default);
    Task DeleteAsync(SmartLink entity, CancellationToken ct = default);
}

public interface IRetailerLinkRepository
{
    Task<RetailerLink?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<RetailerLink>> GetBySmartLinkIdAsync(Guid smartLinkId, CancellationToken ct = default);
    Task<RetailerLink> AddAsync(RetailerLink entity, CancellationToken ct = default);
    Task UpdateAsync(RetailerLink entity, CancellationToken ct = default);
    Task DeleteAsync(RetailerLink entity, CancellationToken ct = default);
}

public interface IRoutingRuleRepository
{
    Task<RoutingRule?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<RoutingRule>> GetBySmartLinkIdAsync(Guid smartLinkId, CancellationToken ct = default);
    Task<RoutingRule> AddAsync(RoutingRule entity, CancellationToken ct = default);
    Task UpdateAsync(RoutingRule entity, CancellationToken ct = default);
    Task DeleteAsync(RoutingRule entity, CancellationToken ct = default);
}

public interface IClickEventRepository
{
    Task AddAsync(ClickEvent entity, CancellationToken ct = default);
    Task<IReadOnlyList<ClickEvent>> GetBySmartLinkIdAsync(Guid smartLinkId, DateTime? from = null, DateTime? to = null, CancellationToken ct = default);
}

public interface IPromotionRedirectRepository
{
    Task<PromotionRedirect?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<PromotionRedirect?> GetBySmartLinkIdAsync(Guid smartLinkId, CancellationToken ct = default);
    Task<PromotionRedirect> AddAsync(PromotionRedirect entity, CancellationToken ct = default);
    Task UpdateAsync(PromotionRedirect entity, CancellationToken ct = default);
    Task DeleteAsync(PromotionRedirect entity, CancellationToken ct = default);
}

public interface IBrokenLinkLogRepository
{
    Task AddAsync(BrokenLinkLog entity, CancellationToken ct = default);
}
