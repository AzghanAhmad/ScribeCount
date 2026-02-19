using Microsoft.EntityFrameworkCore;
using SCLinks.Application.Interfaces;
using SCLinks.Domain.Entities;
using SCLinks.Infrastructure.Persistence;

namespace SCLinks.Infrastructure.Repositories;

public class BrokenLinkLogRepository : IBrokenLinkLogRepository
{
    private readonly AppDbContext _db;

    public BrokenLinkLogRepository(AppDbContext db) => _db = db;

    public async Task AddAsync(BrokenLinkLog entity, CancellationToken ct = default)
    {
        _db.BrokenLinkLogs.Add(entity);
        await _db.SaveChangesAsync(ct);
    }
}
