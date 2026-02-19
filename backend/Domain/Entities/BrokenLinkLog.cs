namespace SCLinks.Domain.Entities;

public class BrokenLinkLog
{
    public Guid Id { get; set; }
    public Guid RetailerLinkId { get; set; }
    public string Status { get; set; } = string.Empty; // e.g. "healthy", "warning", "down"
    public DateTime CheckedAt { get; set; }

    public RetailerLink RetailerLink { get; set; } = null!;
}
