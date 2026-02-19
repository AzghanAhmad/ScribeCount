# SC Smart Links – Backend

.NET 8 Web API for the SC Smart Links SaaS platform. Clean Architecture with Domain, Application, Infrastructure, and API layers.

**Project folders:** `API`, `Application`, `Domain`, `Infrastructure` (no SCLinks prefix).

## Prerequisites

- .NET 8 SDK
- MySQL (e.g. XAMPP MySQL) running on `localhost:3306`
- Database: create a database named `sc_links` (or set connection string in `appsettings.json`)

## Connection string

Default (XAMPP):

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Port=3306;Database=sc_links;User=root;Password=;"
}
```

## Run (one command)

1. Start MySQL (e.g. start Apache + MySQL in XAMPP).
2. From the **backend** folder run:
   ```bash
   npm start
   ```
   Or directly: `dotnet run --project API`
3. Open Swagger: `https://localhost:7xxx/swagger` (or the URL shown in the console).

## First-time setup

- Tables are created automatically on startup via `EnsureCreatedAsync`.
- To use EF migrations instead: add a migration with `dotnet ef migrations add <Name> -p Infrastructure -s API`, then call `db.Database.MigrateAsync()` in `Program.cs`.

## Auth

- **POST /api/auth/register** – body: `{ "name", "email", "password" }`
- **POST /api/auth/login** – body: `{ "email", "password" }` → returns JWT.
- Use the token in the **Authorization** header: `Bearer <token>`.
- Swagger: click **Authorize** and enter `Bearer <your-token>`.

## Public redirect (no auth)

- **GET /r/{slug}** – Resolves the smart link, records a click, and redirects (302) to the chosen retailer URL. Optional headers: `X-Country`, `User-Agent`; optional query: `utm_source`.

## API routes (all JWT-protected except redirect)

- **Smart links:** POST/GET/PUT/DELETE `/api/smartlinks`, GET `/api/smartlinks/{id}`
- **Retailers:** POST `/api/retailers?smartLinkId=...`, PUT/DELETE `/api/retailers/{id}`
- **Rules:** POST `/api/rules?smartLinkId=...`, PUT/DELETE `/api/rules/{id}`
- **Promotions:** POST `/api/promotions?smartLinkId=...`, PUT/DELETE `/api/promotions/{id}`
- **Analytics:** GET `/api/analytics/{smartLinkId}/summary`, `/by-country`, `/by-device`, `/by-retailer` (optional query: `from`, `to`)

## Project structure

- **API** – Controllers, middleware, JWT, Swagger.
- **Application** – DTOs, interfaces, services, routing engine, FluentValidation, AutoMapper.
- **Domain** – Entities (User, SmartLink, RetailerLink, RoutingRule, ClickEvent, PromotionRedirect, BrokenLinkLog).
- **Infrastructure** – EF Core, Pomelo MySQL, repositories, JwtService, LinkHealthCheckerService (background job every 12 hours).

## JWT settings

In `appsettings.json` under `Jwt` set a strong **Secret** (e.g. 32+ characters) for production.
