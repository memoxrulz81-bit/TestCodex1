using Portal.Domain.Entities;

namespace Portal.Application.Interfaces.Persistence;

public interface IProjectRepository
{
    Task<IReadOnlyList<Project>> GetAllAsync(CancellationToken cancellationToken = default);

    Task<Project?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    Task<Project> AddAsync(Project project, CancellationToken cancellationToken = default);
}
