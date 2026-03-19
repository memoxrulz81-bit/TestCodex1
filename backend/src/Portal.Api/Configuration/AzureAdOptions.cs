namespace Portal.Api.Configuration;

public class AzureAdOptions
{
    public const string SectionName = "AzureAd";

    public string Instance { get; set; } = "https://login.microsoftonline.com";

    public string TenantId { get; set; } = "00000000-0000-0000-0000-000000000000";

    public string ClientId { get; set; } = "00000000-0000-0000-0000-000000000000";

    public string Audience { get; set; } = "api://00000000-0000-0000-0000-000000000000";

    public string Scope { get; set; } = "Portal.Access";

    public string? AdminGroupId { get; set; } = "11111111-1111-1111-1111-111111111111";
}
