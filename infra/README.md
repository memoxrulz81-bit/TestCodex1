# Infra Placeholders

Use this folder for Azure infrastructure-as-code. A typical next step is adding Bicep or Terraform definitions for:

- App Service plan
- Backend App Service
- Frontend App Service or Static Web Apps
- Azure SQL Server and Database
- Azure Key Vault
- Application Insights

Keep secrets out of source control and inject them through deployment-time variables or Key Vault references.
