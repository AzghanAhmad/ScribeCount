using FluentValidation;
using SCLinks.Application.DTOs;

namespace SCLinks.Application.Validation;

public class PromotionCreateValidator : AbstractValidator<PromotionCreateDto>
{
    public PromotionCreateValidator()
    {
        RuleFor(x => x.TemporaryUrl).NotEmpty().Must(url => Uri.TryCreate(url, UriKind.Absolute, out _)).WithMessage("Invalid URL.").MaximumLength(2000);
        RuleFor(x => x.StartDate).LessThanOrEqualTo(x => x.EndDate).WithMessage("Start date must be before or equal to end date.");
    }
}
