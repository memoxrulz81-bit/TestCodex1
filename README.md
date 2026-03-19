# Portal Starter Monorepo

Production-ready starter structure for a secure web portal with:

- `backend/` - ASP.NET Core 8 Web API using Clean Architecture
- `frontend/` - Next.js App Router app with TypeScript and Material UI
- `infra/` - placeholder area for Azure infrastructure-as-code

The repository includes Microsoft Entra ID authentication, Azure SQL configuration placeholders, role-aware UI, sample secured APIs, seed data, CI workflow placeholders, and optional Dockerfiles.

## Architecture

### Backend

`backend/src/Portal.Domain`

- Domain entities and base abstractions

`backend/src/Portal.Application`

- DTOs
- AutoMapper profiles
- service layer
- repository interfaces
- application exceptions

`backend/src/Portal.Infrastructure`

- EF Core `PortalDbContext`
- SQL Server/Azure SQL configuration
- repository implementations
- seed data
- migration scaffolding

`backend/src/Portal.Api`

- MVC controllers
- Microsoft Entra ID JWT bearer auth
- RBAC using `[Authorize(Roles = "...")]`
- Swagger
- global exception handling

### Frontend

`frontend/src/app`

- Next.js App Router entrypoints

`frontend/src/components`

- providers, auth controls, shared UI

`frontend/src/features/home`

- home screen and protected dashboard

`frontend/src/lib`

- MSAL bootstrap
- API client/service layer
- environment config
- claim helpers

## Features Included

### Backend endpoints

- `GET /api/test/public` - anonymous test endpoint
- `GET /api/test/me` - authenticated endpoint returning token-derived profile data
- `GET /api/test/admin` - `Admin` role required
- `GET /api/projects` - public seeded data example
- `POST /api/projects` - `Admin` role required

### Home page

- public welcome section
- login state indicator
- user name and email when authenticated
- role chips derived from the Entra token
- login/logout buttons
- buttons to call public, profile, and admin APIs
- on-screen response viewer
- Admin button only when the user resolves to the `Admin` role

### Role handling

The backend supports two common ways to reach the `Admin` role:

1. App role claims that already contain `Admin`
2. Entra group claims mapped to `Admin` using `AzureAd:AdminGroupId`

The frontend mirrors that behavior by deriving the Admin UI role from either the token `roles` claim or the configured admin group id.

## Local Setup

## Prerequisites

- .NET SDK 8
- Node.js 22+
- Azure SQL or SQL Server access
- Microsoft Entra tenant with app registrations

## Backend

1. Copy placeholder settings into your preferred secret store or local environment.
2. Update `backend/src/Portal.Api/appsettings.json` and `backend/src/Portal.Api/appsettings.Development.json` with real non-secret values only.
3. Move secrets such as connection strings into environment variables, `dotnet user-secrets`, or Azure Key Vault references.
4. Restore and run:

```powershell
cd backend
dotnet restore Portal.sln --configfile NuGet.Config
dotnet build Portal.sln
dotnet run --project src/Portal.Api/Portal.Api.csproj
```

5. Apply the migration when the database is ready:

```powershell
cd backend
dotnet ef database update --project src/Portal.Infrastructure/Portal.Infrastructure.csproj --startup-project src/Portal.Api/Portal.Api.csproj
```

Notes:

- `Database:ApplyMigrationsOnStartup` is `false` by default so placeholder connection strings do not break startup.
- Seed data is defined in `ProjectConfiguration`.
- `DesignTimePortalDbContextFactory` enables EF CLI tooling.

## Frontend

1. Copy `frontend/.env.example` to `frontend/.env.local`.
2. Replace the placeholder tenant/client/scope values with your Entra app details.
3. Install and run:

```powershell
cd frontend
npm install
npm run dev
```

4. Open `http://localhost:3000`.

Recommended local values:

- `NEXT_PUBLIC_API_BASE_URL=https://localhost:7001`
- `NEXT_PUBLIC_AZURE_AD_API_SCOPE=api://<api-client-id>/Portal.Access`
- `NEXT_PUBLIC_AZURE_AD_ADMIN_ROLE=Admin`
- `NEXT_PUBLIC_AZURE_AD_ADMIN_GROUP_ID=<group-object-id>` if you want group-based admin mapping

## Microsoft Entra ID Setup

Configure two app registrations or one split registration strategy depending on your tenant standards.

### API app registration

1. Create an app registration for the ASP.NET Core API.
2. Set the Application ID URI to `api://<api-client-id>`.
3. Expose a scope named `Portal.Access`.
4. Create an app role named `Admin` for users or groups.
5. Optional: if you prefer group-based authorization, create an Entra security group and capture its object id for `AdminGroupId`.
6. Add the real API client id and scope to backend/frontend configuration.

### SPA app registration

1. Create an app registration for the Next.js frontend.
2. Add SPA redirect URIs:
   - `http://localhost:3000`
   - your production frontend URL
3. Grant delegated permission to the API scope `Portal.Access`.
4. If using roles, assign the `Admin` app role to test users/groups.
5. If using group mapping, ensure group claims are emitted for the SPA/API as needed.

### Backend configuration mapping

Update the API configuration values:

- `AzureAd:TenantId`
- `AzureAd:ClientId`
- `AzureAd:Audience`
- `AzureAd:Scope`
- `AzureAd:AdminGroupId`

### Frontend configuration mapping

Update the SPA environment values:

- `NEXT_PUBLIC_AZURE_AD_TENANT_ID`
- `NEXT_PUBLIC_AZURE_AD_CLIENT_ID`
- `NEXT_PUBLIC_AZURE_AD_AUTHORITY`
- `NEXT_PUBLIC_AZURE_AD_REDIRECT_URI`
- `NEXT_PUBLIC_AZURE_AD_POST_LOGOUT_REDIRECT_URI`
- `NEXT_PUBLIC_AZURE_AD_API_SCOPE`
- `NEXT_PUBLIC_AZURE_AD_ADMIN_ROLE`
- `NEXT_PUBLIC_AZURE_AD_ADMIN_GROUP_ID`

## Azure Deployment Notes

### Backend to Azure App Service

1. Provision an App Service and configure `.NET 8`.
2. Add application settings for the SQL connection string and Entra values.
3. Prefer Key Vault references for secrets:
   - SQL connection string
   - any future downstream API secrets
4. Publish using GitHub Actions, Azure DevOps, or `az webapp deploy`.

### Frontend to Azure App Service or Static Web Apps

1. Deploy the Next.js app to Azure App Service when you need the Node runtime on the server.
2. Deploy to Static Web Apps when that aligns better with your hosting model and auth/networking setup.
3. Store all public runtime settings as environment variables in the hosting service.

### Key Vault guidance

- Store secrets in Azure Key Vault, not `appsettings.json` or `.env.local` committed files.
- Reference Key Vault secrets from App Service settings.
- Use managed identity for App Service to access Key Vault.

## CI/CD

Placeholder GitHub Actions workflows live in:

- `.github/workflows/ci.yml`
- `.github/workflows/deploy-placeholder.yml`

These are intentionally basic and meant to be extended with:

- Azure login
- App Service deploy steps
- environment-specific secrets
- database migration stage approvals

## Docker

Optional Dockerfiles are included:

- `backend/src/Portal.Api/Dockerfile`
- `frontend/Dockerfile`

The frontend Dockerfile assumes a generated lockfile is present after dependency installation.

## Customization Notes

- Replace demo text, branding, and seeded `Project` records as needed.
- Extend the application layer with additional services/use cases before adding more controllers.
- Add validation, telemetry, health checks, and integration tests for production rollouts.
