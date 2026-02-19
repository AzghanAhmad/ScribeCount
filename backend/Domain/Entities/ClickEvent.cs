namespace SCLinks.Domain.Entities;

public class ClickEvent
{
    public Guid Id { get; set; }
    public Guid SmartLinkId { get; set; }
    public string? Country { get; set; }
    public string? DeviceType { get; set; }
    public string? PlatformSource { get; set; }
    public string? CampaignName { get; set; }
    public string? SelectedRetailer { get; set; }
    public DateTime ClickedAt { get; set; }

    public SmartLink SmartLink { get; set; } = null!;
}
