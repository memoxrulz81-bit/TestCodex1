using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Portal.Api.Controllers;

[ApiController]
[Route("api/test")]
public class TestController : ControllerBase
{
    [HttpGet("public")]
    [AllowAnonymous]
    public IActionResult Public()
    {
        return Ok(new
        {
            message = "Public endpoint reached successfully.",
            utcNow = DateTimeOffset.UtcNow,
            authenticated = User.Identity?.IsAuthenticated ?? false
        });
    }

    [HttpGet("me")]
    [Authorize]
    public IActionResult Me()
    {
        var roles = User.Claims
            .Where(claim => claim.Type is "roles" or ClaimTypes.Role)
            .Select(claim => claim.Value)
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToArray();

        var groups = User.Claims
            .Where(claim => claim.Type == "groups")
            .Select(claim => claim.Value)
            .ToArray();

        return Ok(new
        {
            name = User.FindFirstValue("name") ?? User.Identity?.Name,
            email = User.FindFirstValue(ClaimTypes.Email) ?? User.FindFirstValue("preferred_username"),
            roles,
            groups,
            claims = User.Claims.Select(claim => new
            {
                claim.Type,
                claim.Value
            })
        });
    }

    [HttpGet("admin")]
    [Authorize(Roles = "Admin")]
    public IActionResult Admin()
    {
        return Ok(new
        {
            message = "Admin endpoint reached successfully.",
            user = User.FindFirstValue("name") ?? User.Identity?.Name
        });
    }
}
