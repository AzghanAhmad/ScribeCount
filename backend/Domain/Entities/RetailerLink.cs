namespace SCLinks.Domain.Entities;

public class RetailerLink
{
    public Guid Id { get; set; }
    public Guid SmartLinkId { get; set; }
    public string RetailerName { get; set; } = string.Empty;
    public string CountryCode { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public bool IsAvailable { get; set; } = true;
    public int Priority { get; set; }

    public SmartLink SmartLink { get; set; } = null!;
    public ICollection<BrokenLinkLog> BrokenLinkLogs { get; set; } = new List<BrokenLinkLog>();
}
