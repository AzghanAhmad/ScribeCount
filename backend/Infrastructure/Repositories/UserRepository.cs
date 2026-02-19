using Microsoft.EntityFrameworkCore;
using SCLinks.Application.Interfaces;
using SCLinks.Domain.Entities;
using SCLinks.Infrastructure.Persistence;

namespace SCLinks.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _db;

    public UserRepository(AppDbContext db) => _db = db;

    public async Task<User?> GetByIdAsync(Guid id, CancellationToken ct = default) =>
        await _db.Users.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, ct);

    public async Task<User?> GetByEmailAsync(string email, CancellationToken ct = default) =>
        await _db.Users.FirstOrDefaultAsync(x => x.Email == email, ct);

    public async Task<User> AddAsync(User entity, CancellationToken ct = default)
    {
        _db.Users.Add(entity);
        await _db.SaveChangesAsync(ct);
        return entity;
    }

    public async Task UpdateAsync(User entity, CancellationToken ct = default)
    {
        _db.Users.Update(entity);
        await _db.SaveChangesAsync(ct);
    }
}
