using Microsoft.EntityFrameworkCore;
using SCLinks.Application.Interfaces;
using SCLinks.Domain.Entities;
using SCLinks.Infrastructure.Persistence;

namespace SCLinks.Infrastructure.Repositories;

public class ClickEventRepository : IClickEventRepository
{
    private readonly AppDbContext _db;

    public ClickEventRepository(AppDbContext db) => _db = db;

    public async Task AddAsync(ClickEvent entity, CancellationToken ct = default)
    {
        _db.ClickEvents.Add(entity);
        await _db.SaveChangesAsync(ct);
    }

    public async Task<IReadOnlyList<ClickEvent>> GetBySmartLinkIdAsync(Guid smartLinkId, DateTime? from = null, DateTime? to = null, CancellationToken ct = default)
    {
        var query = _db.ClickEvents.AsNoTracking().Where(x => x.SmartLinkId == smartLinkId);
        if (from.HasValue) query = query.Where(x => x.ClickedAt >= from.Value);
        if (to.HasValue) query = query.Where(x => x.ClickedAt <= to.Value);
        return await query.OrderByDescending(x => x.ClickedAt).ToListAsync(ct);
    }
}
