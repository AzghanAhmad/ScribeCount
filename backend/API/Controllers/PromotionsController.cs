using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SCLinks.Application.DTOs;
using SCLinks.Application.Services;

namespace SCLinks.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PromotionsController : ControllerBase
{
    private readonly IPromotionService _service;

    public PromotionsController(IPromotionService service)
    {
        _service = service;
    }

    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost]
    public async Task<IActionResult> Create([FromQuery] Guid smartLinkId, [FromBody] PromotionCreateDto dto, CancellationToken ct)
    {
        var result = await _service.CreateAsync(smartLinkId, UserId, dto, ct);
        if (result == null)
            return BadRequest(new { error = "Smart link not found or promotion already exists." });
        return Ok(result);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] PromotionUpdateDto dto, CancellationToken ct)
    {
        var result = await _service.UpdateAsync(id, UserId, dto, ct);
        if (result == null)
            return NotFound();
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var ok = await _service.DeleteAsync(id, UserId, ct);
        if (!ok)
            return NotFound();
        return NoContent();
    }
}
