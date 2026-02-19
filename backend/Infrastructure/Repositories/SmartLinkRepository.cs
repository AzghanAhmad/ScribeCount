using Microsoft.EntityFrameworkCore;
using SCLinks.Application.Interfaces;
using SCLinks.Domain.Entities;
using SCLinks.Infrastructure.Persistence;

namespace SCLinks.Infrastructure.Repositories;

public class SmartLinkRepository : ISmartLinkRepository
{
    private readonly AppDbContext _db;

    public SmartLinkRepository(AppDbContext db) => _db = db;

    public async Task<SmartLink?> GetByIdAsync(Guid id, CancellationToken ct = default) =>
        await _db.SmartLinks.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, ct);

    public async Task<SmartLink?> GetBySlugAsync(string slug, CancellationToken ct = default) =>
        await _db.SmartLinks
            .Include(x => x.RetailerLinks)
            .Include(x => x.RoutingRules)
            .Include(x => x.PromotionRedirect)
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Slug == slug, ct);

    public async Task<SmartLink?> GetByIdWithDetailsAsync(Guid id, CancellationToken ct = default) =>
        await _db.SmartLinks
            .Include(x => x.RetailerLinks)
            .Include(x => x.RoutingRules)
            .Include(x => x.PromotionRedirect)
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id, ct);

    public async Task<IReadOnlyList<SmartLink>> GetByUserIdAsync(Guid userId, CancellationToken ct = default) =>
        await _db.SmartLinks.AsNoTracking().Where(x => x.UserId == userId).OrderByDescending(x => x.CreatedAt).ToListAsync(ct);

    public async Task<bool> SlugExistsAsync(string slug, Guid? excludeId, CancellationToken ct = default)
    {
        var query = _db.SmartLinks.Where(x => x.Slug == slug);
        if (excludeId.HasValue) query = query.Where(x => x.Id != excludeId.Value);
        return await query.AnyAsync(ct);
    }

    public async Task<SmartLink> AddAsync(SmartLink entity, CancellationToken ct = default)
    {
        _db.SmartLinks.Add(entity);
        await _db.SaveChangesAsync(ct);
        return entity;
    }

    public async Task UpdateAsync(SmartLink entity, CancellationToken ct = default)
    {
        _db.SmartLinks.Update(entity);
        await _db.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(SmartLink entity, CancellationToken ct = default)
    {
        _db.SmartLinks.Remove(entity);
        await _db.SaveChangesAsync(ct);
    }
}
