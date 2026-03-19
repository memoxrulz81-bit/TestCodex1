FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["src/Portal.Api/Portal.Api.csproj", "src/Portal.Api/"]
COPY ["src/Portal.Application/Portal.Application.csproj", "src/Portal.Application/"]
COPY ["src/Portal.Domain/Portal.Domain.csproj", "src/Portal.Domain/"]
COPY ["src/Portal.Infrastructure/Portal.Infrastructure.csproj", "src/Portal.Infrastructure/"]
COPY ["NuGet.Config", "./"]

RUN dotnet restore "src/Portal.Api/Portal.Api.csproj" --configfile NuGet.Config

COPY . .
RUN dotnet publish "src/Portal.Api/Portal.Api.csproj" -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "Portal.Api.dll"]
