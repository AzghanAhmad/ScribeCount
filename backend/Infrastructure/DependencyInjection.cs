using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SCLinks.Application.Interfaces;
using SCLinks.Application.Routing;
using SCLinks.Application.Services;
using SCLinks.Infrastructure.Persistence;
using SCLinks.Infrastructure.Repositories;
using SCLinks.Infrastructure.Services;

namespace SCLinks.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var conn = configuration.GetConnectionString("DefaultConnection")
            ?? "Server=localhost;Port=3306;Database=sc_links;User=root;Password=;";

        services.AddDbContext<AppDbContext>(o =>
            o.UseMySql(conn, ServerVersion.AutoDetect(conn)));

        services.Configure<JwtSettings>(configuration.GetSection(JwtSettings.SectionName));

        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<ISmartLinkRepository, SmartLinkRepository>();
        services.AddScoped<IRetailerLinkRepository, RetailerLinkRepository>();
        services.AddScoped<IRoutingRuleRepository, RoutingRuleRepository>();
        services.AddScoped<IClickEventRepository, ClickEventRepository>();
        services.AddScoped<IPromotionRedirectRepository, PromotionRedirectRepository>();
        services.AddScoped<IBrokenLinkLogRepository, BrokenLinkLogRepository>();

        services.AddScoped<IJwtService, JwtService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<ISmartLinkService, SmartLinkService>();
        services.AddScoped<IRetailerLinkService, RetailerLinkService>();
        services.AddScoped<IRoutingRuleService, RoutingRuleService>();
        services.AddScoped<IPromotionService, PromotionService>();
        services.AddScoped<IAnalyticsService, AnalyticsService>();
        services.AddScoped<IRoutingEngineService, RoutingEngineService>();

        services.AddHttpClient();
        services.AddHostedService<LinkHealthCheckerService>();

        return services;
    }
}
