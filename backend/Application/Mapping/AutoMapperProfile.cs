using AutoMapper;
using SCLinks.Application.DTOs;
using SCLinks.Domain.Entities;

namespace SCLinks.Application.Mapping;

public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        CreateMap<SmartLink, SmartLinkResponseDto>()
            .ForMember(d => d.Status, o => o.MapFrom(s => s.Status.ToString()))
            .ForMember(d => d.Retailers, o => o.MapFrom(s => s.RetailerLinks))
            .ForMember(d => d.Rules, o => o.MapFrom(s => s.RoutingRules))
            .ForMember(d => d.Promotion, o => o.MapFrom(s => s.PromotionRedirect));
        CreateMap<RetailerLink, RetailerResponseDto>();
        CreateMap<RoutingRule, RoutingRuleResponseDto>()
            .ForMember(d => d.RuleType, o => o.MapFrom(s => s.RuleType.ToString()));
        CreateMap<PromotionRedirect, PromotionResponseDto>();
    }
}
