namespace SCLinks.Domain.Entities;

public enum SmartLinkStatus
{
    Active = 0,
    Scheduled = 1,
    Expired = 2
}

public class SmartLink
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string BookTitle { get; set; } = string.Empty;
    public string? CoverImageUrl { get; set; }
    public DateTime? ReleaseDate { get; set; }
    public bool IsPreOrder { get; set; }
    public SmartLinkStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public User User { get; set; } = null!;
    public ICollection<RetailerLink> RetailerLinks { get; set; } = new List<RetailerLink>();
    public ICollection<RoutingRule> RoutingRules { get; set; } = new List<RoutingRule>();
    public ICollection<ClickEvent> ClickEvents { get; set; } = new List<ClickEvent>();
    public PromotionRedirect? PromotionRedirect { get; set; }
}
