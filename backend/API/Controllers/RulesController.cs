using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SCLinks.Application.DTOs;
using SCLinks.Application.Services;

namespace SCLinks.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class RulesController : ControllerBase
{
    private readonly IRoutingRuleService _service;

    public RulesController(IRoutingRuleService service)
    {
        _service = service;
    }

    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost]
    public async Task<IActionResult> Create([FromQuery] Guid smartLinkId, [FromBody] RoutingRuleCreateDto dto, CancellationToken ct)
    {
        var result = await _service.CreateAsync(smartLinkId, UserId, dto, ct);
        if (result == null)
            return BadRequest(new { error = "Smart link not found or invalid rule type." });
        return Ok(result);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] RoutingRuleUpdateDto dto, CancellationToken ct)
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
