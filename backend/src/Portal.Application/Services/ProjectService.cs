using AutoMapper;
using Portal.Application.Common.Exceptions;
using Portal.Application.DTOs.Projects;
using Portal.Application.Interfaces.Persistence;
using Portal.Application.Interfaces.Services;
using Portal.Domain.Entities;

namespace Portal.Application.Services;

public class ProjectService : IProjectService
{
    private readonly IMapper _mapper;
    private readonly IProjectRepository _projectRepository;

    public ProjectService(IProjectRepository projectRepository, IMapper mapper)
    {
        _projectRepository = projectRepository;
        _mapper = mapper;
    }

    public async Task<IReadOnlyList<ProjectDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var projects = await _projectRepository.GetAllAsync(cancellationToken);
        return _mapper.Map<IReadOnlyList<ProjectDto>>(projects);
    }

    public async Task<ProjectDto> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var project = await _projectRepository.GetByIdAsync(id, cancellationToken);

        if (project is null)
        {
            throw new NotFoundException($"Project '{id}' was not found.");
        }

        return _mapper.Map<ProjectDto>(project);
    }

    public async Task<ProjectDto> CreateAsync(CreateProjectRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            throw new ArgumentException("Project name is required.", nameof(request.Name));
        }

        var project = _mapper.Map<Project>(request);
        project.Id = Guid.NewGuid();
        project.CreatedUtc = DateTimeOffset.UtcNow;

        var createdProject = await _projectRepository.AddAsync(project, cancellationToken);
        return _mapper.Map<ProjectDto>(createdProject);
    }
}
