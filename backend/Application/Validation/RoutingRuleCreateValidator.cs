using FluentValidation;
using SCLinks.Application.DTOs;

namespace SCLinks.Application.Validation;

public class RoutingRuleCreateValidator : AbstractValidator<RoutingRuleCreateDto>
{
    public RoutingRuleCreateValidator()
    {
        RuleFor(x => x.RuleType).NotEmpty().Must(x => string.Equals(x, "Country", StringComparison.OrdinalIgnoreCase) || string.Equals(x, "Device", StringComparison.OrdinalIgnoreCase) || string.Equals(x, "Format", StringComparison.OrdinalIgnoreCase) || string.Equals(x, "Availability", StringComparison.OrdinalIgnoreCase));
        RuleFor(x => x.ConditionValue).NotEmpty().MaximumLength(500);
        RuleFor(x => x.Priority).InclusiveBetween(0, 999);
    }
}
