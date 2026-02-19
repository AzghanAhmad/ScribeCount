using Microsoft.EntityFrameworkCore;
using SCLinks.Application.Interfaces;
using SCLinks.Domain.Entities;
using SCLinks.Infrastructure.Persistence;

namespace SCLinks.Infrastructure.Repositories;

public class RetailerLinkRepository : IRetailerLinkRepository
{
    private readonly AppDbContext _db;

    public RetailerLinkRepository(AppDbContext db) => _db = db;

    public async Task<RetailerLink?> GetByIdAsync(Guid id, CancellationToken ct = default) =>
        await _db.RetailerLinks.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, ct);

    public async Task<IReadOnlyList<RetailerLink>> GetBySmartLinkIdAsync(Guid smartLinkId, CancellationToken ct = default) =>
        await _db.RetailerLinks.AsNoTracking().Where(x => x.SmartLinkId == smartLinkId).OrderBy(x => x.Priority).ToListAsync(ct);

    public async Task<RetailerLink> AddAsync(RetailerLink entity, CancellationToken ct = default)
    {
        _db.RetailerLinks.Add(entity);
        await _db.SaveChangesAsync(ct);
        return entity;
    }

    public async Task UpdateAsync(RetailerLink entity, CancellationToken ct = default)
    {
        _db.RetailerLinks.Update(entity);
        await _db.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(RetailerLink entity, CancellationToken ct = default)
    {
        _db.RetailerLinks.Remove(entity);
        await _db.SaveChangesAsync(ct);
    }
}
