using Portal.Application.DTOs.Projects;

namespace Portal.Application.Interfaces.Services;

public interface IProjectService
{
    Task<IReadOnlyList<ProjectDto>> GetAllAsync(CancellationToken cancellationToken = default);

    Task<ProjectDto> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    Task<ProjectDto> CreateAsync(CreateProjectRequest request, CancellationToken cancellationToken = default);
}
