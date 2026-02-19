namespace SCLinks.Domain.Entities;

public class PromotionRedirect
{
    public Guid Id { get; set; }
    public Guid SmartLinkId { get; set; }
    public string TemporaryUrl { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }

    public SmartLink SmartLink { get; set; } = null!;
}
