using SCLinks.Application.DTOs;
using SCLinks.Application.Interfaces;
using SCLinks.Domain.Entities;

namespace SCLinks.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepo;
    private readonly IJwtService _jwtService;

    public AuthService(IUserRepository userRepo, IJwtService jwtService)
    {
        _userRepo = userRepo;
        _jwtService = jwtService;
    }

    public async Task<AuthResponseDto?> RegisterAsync(RegisterRequestDto dto, CancellationToken ct = default)
    {
        if (await _userRepo.GetByEmailAsync(dto.Email, ct) != null)
            return null;

        var user = new User
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            CreatedAt = DateTime.UtcNow
        };
        await _userRepo.AddAsync(user, ct);
        var token = _jwtService.GenerateToken(user);
        return new AuthResponseDto(token, user.Email, user.Name, user.Id);
    }

    public async Task<AuthResponseDto?> LoginAsync(LoginRequestDto dto, CancellationToken ct = default)
    {
        var user = await _userRepo.GetByEmailAsync(dto.Email, ct);
        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return null;

        var token = _jwtService.GenerateToken(user);
        return new AuthResponseDto(token, user.Email, user.Name, user.Id);
    }
}
