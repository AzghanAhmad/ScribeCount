using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SCLinks.Application.Services;

namespace SCLinks.API.Controllers;

[ApiController]
[Route("api/analytics")]
[Authorize]
public class AnalyticsController : ControllerBase
{
    private readonly IAnalyticsService _service;

    public AnalyticsController(IAnalyticsService service)
    {
        _service = service;
    }

    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("{smartLinkId:guid}/summary")]
    public async Task<IActionResult> GetSummary(Guid smartLinkId, [FromQuery] DateTime? from, [FromQuery] DateTime? to, CancellationToken ct)
    {
        var result = await _service.GetSummaryAsync(smartLinkId, UserId, from, to, ct);
        if (result == null)
            return NotFound();
        return Ok(result);
    }

    [HttpGet("{smartLinkId:guid}/by-country")]
    public async Task<IActionResult> GetByCountry(Guid smartLinkId, [FromQuery] DateTime? from, [FromQuery] DateTime? to, CancellationToken ct)
    {
        var result = await _service.GetByCountryAsync(smartLinkId, UserId, from, to, ct);
        return Ok(result);
    }

    [HttpGet("{smartLinkId:guid}/by-device")]
    public async Task<IActionResult> GetByDevice(Guid smartLinkId, [FromQuery] DateTime? from, [FromQuery] DateTime? to, CancellationToken ct)
    {
        var result = await _service.GetByDeviceAsync(smartLinkId, UserId, from, to, ct);
        return Ok(result);
    }

    [HttpGet("{smartLinkId:guid}/by-retailer")]
    public async Task<IActionResult> GetByRetailer(Guid smartLinkId, [FromQuery] DateTime? from, [FromQuery] DateTime? to, CancellationToken ct)
    {
        var result = await _service.GetByRetailerAsync(smartLinkId, UserId, from, to, ct);
        return Ok(result);
    }
}
