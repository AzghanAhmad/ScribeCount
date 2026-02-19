using FluentValidation;
using SCLinks.Application.DTOs;

namespace SCLinks.Application.Validation;

public class RetailerCreateValidator : AbstractValidator<RetailerCreateDto>
{
    public RetailerCreateValidator()
    {
        RuleFor(x => x.RetailerName).NotEmpty().MaximumLength(200);
        RuleFor(x => x.CountryCode).NotEmpty().Length(2);
        RuleFor(x => x.Url).NotEmpty().Must(url => Uri.TryCreate(url, UriKind.Absolute, out _)).WithMessage("Invalid URL.").MaximumLength(2000);
        RuleFor(x => x.Priority).InclusiveBetween(0, 999);
    }
}
