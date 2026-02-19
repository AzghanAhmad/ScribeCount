namespace SCLinks.Domain.Entities;

public enum RuleType
{
    Country = 0,
    Device = 1,
    Format = 2,
    Availability = 3
}

public class RoutingRule
{
    public Guid Id { get; set; }
    public Guid SmartLinkId { get; set; }
    public RuleType RuleType { get; set; }
    public string ConditionValue { get; set; } = string.Empty;
    public Guid? TargetRetailerId { get; set; }
    public int Priority { get; set; }

    public SmartLink SmartLink { get; set; } = null!;
}
