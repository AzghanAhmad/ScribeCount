using SCLinks.Domain.Entities;

namespace SCLinks.Application.Services;

public interface IJwtService
{
    string GenerateToken(User user);
}
