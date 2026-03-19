namespace Portal.Domain.Common;

public abstract class EntityBase
{
    public Guid Id { get; set; }

    public DateTimeOffset CreatedUtc { get; set; } = DateTimeOffset.UtcNow;

    public DateTimeOffset? UpdatedUtc { get; set; }
}
