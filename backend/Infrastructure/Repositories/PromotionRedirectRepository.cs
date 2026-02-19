using Microsoft.EntityFrameworkCore;
using SCLinks.Application.Interfaces;
using SCLinks.Domain.Entities;
using SCLinks.Infrastructure.Persistence;

namespace SCLinks.Infrastructure.Repositories;

public class PromotionRedirectRepository : IPromotionRedirectRepository
{
    private readonly AppDbContext _db;

    public PromotionRedirectRepository(AppDbContext db) => _db = db;

    public async Task<PromotionRedirect?> GetByIdAsync(Guid id, CancellationToken ct = default) =>
        await _db.PromotionRedirects.FirstOrDefaultAsync(x => x.Id == id, ct);

    public async Task<PromotionRedirect?> GetBySmartLinkIdAsync(Guid smartLinkId, CancellationToken ct = default) =>
        await _db.PromotionRedirects.FirstOrDefaultAsync(x => x.SmartLinkId == smartLinkId, ct);

    public async Task<PromotionRedirect> AddAsync(PromotionRedirect entity, CancellationToken ct = default)
    {
        _db.PromotionRedirects.Add(entity);
        await _db.SaveChangesAsync(ct);
        return entity;
    }

    public async Task UpdateAsync(PromotionRedirect entity, CancellationToken ct = default)
    {
        _db.PromotionRedirects.Update(entity);
        await _db.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(PromotionRedirect entity, CancellationToken ct = default)
    {
        _db.PromotionRedirects.Remove(entity);
        await _db.SaveChangesAsync(ct);
    }
}
