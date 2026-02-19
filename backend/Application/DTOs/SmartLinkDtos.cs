namespace SCLinks.Application.DTOs;

public record SmartLinkCreateDto(
    string Slug,
    string BookTitle,
    string? CoverImageUrl,
    DateTime? ReleaseDate,
    bool IsPreOrder
);

public record SmartLinkUpdateDto(
    string? BookTitle,
    string? CoverImageUrl,
    DateTime? ReleaseDate,
    bool? IsPreOrder,
    string? Status
);

public record SmartLinkResponseDto(
    Guid Id,
    Guid UserId,
    string Slug,
    string BookTitle,
    string? CoverImageUrl,
    DateTime? ReleaseDate,
    bool IsPreOrder,
    string Status,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    IReadOnlyList<RetailerResponseDto>? Retailers = null,
    IReadOnlyList<RoutingRuleResponseDto>? Rules = null,
    PromotionResponseDto? Promotion = null
);

public record RetailerCreateDto(
    string RetailerName,
    string CountryCode,
    string Url,
    bool IsAvailable,
    int Priority
);

public record RetailerUpdateDto(
    string? RetailerName,
    string? CountryCode,
    string? Url,
    bool? IsAvailable,
    int? Priority
);

public record RetailerResponseDto(
    Guid Id,
    Guid SmartLinkId,
    string RetailerName,
    string CountryCode,
    string Url,
    bool IsAvailable,
    int Priority
);

public record RoutingRuleCreateDto(
    string RuleType,
    string ConditionValue,
    Guid? TargetRetailerId,
    int Priority
);

public record RoutingRuleUpdateDto(
    string? RuleType,
    string? ConditionValue,
    Guid? TargetRetailerId,
    int? Priority
);

public record RoutingRuleResponseDto(
    Guid Id,
    Guid SmartLinkId,
    string RuleType,
    string ConditionValue,
    Guid? TargetRetailerId,
    int Priority
);

public record PromotionCreateDto(
    string TemporaryUrl,
    DateTime StartDate,
    DateTime EndDate
);

public record PromotionUpdateDto(
    string? TemporaryUrl,
    DateTime? StartDate,
    DateTime? EndDate
);

public record PromotionResponseDto(
    Guid Id,
    Guid SmartLinkId,
    string TemporaryUrl,
    DateTime StartDate,
    DateTime EndDate
);
