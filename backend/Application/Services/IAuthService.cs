using SCLinks.Application.DTOs;

namespace SCLinks.Application.Services;

public interface IAuthService
{
    Task<AuthResponseDto?> RegisterAsync(RegisterRequestDto dto, CancellationToken ct = default);
    Task<AuthResponseDto?> LoginAsync(LoginRequestDto dto, CancellationToken ct = default);
}
