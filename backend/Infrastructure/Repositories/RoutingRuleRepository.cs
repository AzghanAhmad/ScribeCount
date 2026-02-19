using Microsoft.EntityFrameworkCore;
using SCLinks.Application.Interfaces;
using SCLinks.Domain.Entities;
using SCLinks.Infrastructure.Persistence;

namespace SCLinks.Infrastructure.Repositories;

public class RoutingRuleRepository : IRoutingRuleRepository
{
    private readonly AppDbContext _db;

    public RoutingRuleRepository(AppDbContext db) => _db = db;

    public async Task<RoutingRule?> GetByIdAsync(Guid id, CancellationToken ct = default) =>
        await _db.RoutingRules.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, ct);

    public async Task<IReadOnlyList<RoutingRule>> GetBySmartLinkIdAsync(Guid smartLinkId, CancellationToken ct = default) =>
        await _db.RoutingRules.AsNoTracking().Where(x => x.SmartLinkId == smartLinkId).OrderBy(x => x.Priority).ToListAsync(ct);

    public async Task<RoutingRule> AddAsync(RoutingRule entity, CancellationToken ct = default)
    {
        _db.RoutingRules.Add(entity);
        await _db.SaveChangesAsync(ct);
        return entity;
    }

    public async Task UpdateAsync(RoutingRule entity, CancellationToken ct = default)
    {
        _db.RoutingRules.Update(entity);
        await _db.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(RoutingRule entity, CancellationToken ct = default)
    {
        _db.RoutingRules.Remove(entity);
        await _db.SaveChangesAsync(ct);
    }
}
