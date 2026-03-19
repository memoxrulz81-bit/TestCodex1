using AutoMapper;
using Portal.Application.DTOs.Projects;
using Portal.Domain.Entities;

namespace Portal.Application.Mappings;

public class ProjectProfile : Profile
{
    public ProjectProfile()
    {
        CreateMap<Project, ProjectDto>();
        CreateMap<CreateProjectRequest, Project>()
            .ForMember(destination => destination.Id, options => options.Ignore())
            .ForMember(destination => destination.CreatedUtc, options => options.Ignore())
            .ForMember(destination => destination.UpdatedUtc, options => options.Ignore());
    }
}
