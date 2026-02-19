using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SCLinks.Application.DTOs;
using SCLinks.Application.Services;

namespace SCLinks.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SmartLinksController : ControllerBase
{
    private readonly ISmartLinkService _service;

    public SmartLinksController(ISmartLinkService service)
    {
        _service = service;
    }

    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] SmartLinkCreateDto dto, CancellationToken ct)
    {
        var result = await _service.CreateAsync(UserId, dto, ct);
        if (result == null)
            return BadRequest(new { error = "Slug already exists." });
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var list = await _service.GetByUserAsync(UserId, ct);
        return Ok(list);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var result = await _service.GetByIdAsync(id, UserId, ct);
        if (result == null)
            return NotFound();
        return Ok(result);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] SmartLinkUpdateDto dto, CancellationToken ct)
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
