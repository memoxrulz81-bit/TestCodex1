using Portal.Domain.Common;

namespace Portal.Domain.Entities;

public class Project : EntityBase
{
    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string Status { get; set; } = "Planned";
}
