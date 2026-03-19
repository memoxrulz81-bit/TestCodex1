using Microsoft.EntityFrameworkCore;
using Portal.Application.Interfaces.Persistence;
using Portal.Domain.Entities;
using Portal.Infrastructure.Persistence;

namespace Portal.Infrastructure.Repositories;

public class ProjectRepository : IProjectRepository
{
    private readonly PortalDbContext _dbContext;

    public ProjectRepository(PortalDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<Project>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.Projects
            .AsNoTracking()
            .OrderBy(project => project.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<Project?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Projects
            .AsNoTracking()
            .SingleOrDefaultAsync(project => project.Id == id, cancellationToken);
    }

    public async Task<Project> AddAsync(Project project, CancellationToken cancellationToken = default)
    {
        await _dbContext.Projects.AddAsync(project, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return project;
    }
}
