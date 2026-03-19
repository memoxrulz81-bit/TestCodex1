using AutoMapper;
using Microsoft.Extensions.DependencyInjection;
using Portal.Application.DTOs.Projects;
using Portal.Application.Interfaces.Persistence;
using Portal.Application.Mappings;
using Portal.Application.Services;
using Portal.Domain.Entities;

namespace Portal.Application.Tests.Services;

public class ProjectServiceTests
{
    [Fact]
    public async Task CreateAsync_ShouldPersistAndMapProject()
    {
        var repository = new InMemoryProjectRepository();
        var serviceProvider = new ServiceCollection()
            .AddLogging()
            .AddAutoMapper(_ => { }, typeof(ProjectProfile).Assembly)
            .BuildServiceProvider();
        var mapper = serviceProvider.GetRequiredService<IMapper>();
        var service = new ProjectService(repository, mapper);

        var result = await service.CreateAsync(new CreateProjectRequest
        {
            Name = "New secured portal",
            Description = "Validates the application service orchestration.",
            Status = "Active"
        });

        Assert.Equal("New secured portal", result.Name);
        Assert.Single(repository.Projects);
    }

    private sealed class InMemoryProjectRepository : IProjectRepository
    {
        public List<Project> Projects { get; } = [];

        public Task<Project> AddAsync(Project project, CancellationToken cancellationToken = default)
        {
            Projects.Add(project);
            return Task.FromResult(project);
        }

        public Task<IReadOnlyList<Project>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            return Task.FromResult<IReadOnlyList<Project>>(Projects);
        }

        public Task<Project?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return Task.FromResult(Projects.SingleOrDefault(project => project.Id == id));
        }
    }
}
