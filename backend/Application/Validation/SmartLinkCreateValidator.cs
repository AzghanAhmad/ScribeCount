using FluentValidation;
using SCLinks.Application.DTOs;

namespace SCLinks.Application.Validation;

public class SmartLinkCreateValidator : AbstractValidator<SmartLinkCreateDto>
{
    public SmartLinkCreateValidator()
    {
        RuleFor(x => x.Slug).NotEmpty().MaximumLength(64).Matches("^[a-z0-9_-]+$").WithMessage("Slug must be lowercase alphanumeric, hyphens or underscores.");
        RuleFor(x => x.BookTitle).NotEmpty().MaximumLength(500);
        RuleFor(x => x.CoverImageUrl).MaximumLength(2000).When(x => !string.IsNullOrEmpty(x.CoverImageUrl));
        RuleFor(x => x.ReleaseDate).GreaterThan(DateTime.UtcNow.Date).When(x => x.ReleaseDate.HasValue && x.IsPreOrder);
    }
}
