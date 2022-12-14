using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Activities;
using Application.Comments;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            //This mapping is to save all properties
            //Starting the 1 class to he 2 class
            CreateMap<Activity,Activity>();

            //for configure properties is ForMember
            CreateMap<Activity, ActivityDto>()
                .ForMember(d => d.HostUsername, options => options.MapFrom(source => source.Attendees
                    .FirstOrDefault(x => x.IsHost).AppUser.UserName));

            CreateMap<ActivityAttendee, AttendeeDto>()
                .ForMember(d => d.DisplayName, options => options.MapFrom(source => source.AppUser.DisplayName))
                .ForMember(d => d.Username, options => options.MapFrom(source => source.AppUser.UserName))
                .ForMember(d => d.Bio, options => options.MapFrom(source => source.AppUser.Bio))
                .ForMember(d=>d.Image, options=>options.MapFrom(source=>source.AppUser.Photos.FirstOrDefault(x=>x.IsMain).Url));
            
            //We need to create a mapping for get the Photos
            CreateMap<AppUser,Profiles.Profile>()
                .ForMember(d=>d.Image, options=>options.MapFrom(source=>source.Photos.FirstOrDefault(x=>x.IsMain).Url));

            //New map for map our new Comments Feature
            //From The comment to the ComentDto
            CreateMap<Comment, CommentDto>()
                .ForMember(d => d.DisplayName, options => options.MapFrom(source => source.Author.DisplayName))
                .ForMember(d => d.UserName, options => options.MapFrom(source => source.Author.UserName))
                .ForMember(d=>d.Image, options=>options.MapFrom(source=>source.Author.Photos.FirstOrDefault(x=>x.IsMain).Url));
            
        }//end constructor MappingProfiles
    }//end class MappingProfile
}//end namespace