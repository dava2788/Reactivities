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
            string currentUsername= null;
            //This mapping is to save all properties
            //Starting the 1 class to he 2 class
            CreateMap<Activity,Activity>();

            //for configure properties is ForMember
            CreateMap<Activity, ActivityDto>()
                .ForMember(destination => destination.HostUsername, options => options.MapFrom(source => source.Attendees
                    .FirstOrDefault(x => x.IsHost).AppUser.UserName));

            CreateMap<ActivityAttendee, AttendeeDto>()
                .ForMember(destination => destination.DisplayName, options => options.MapFrom(source => source.AppUser.DisplayName))
                .ForMember(destination => destination.Username, options => options.MapFrom(source => source.AppUser.UserName))
                .ForMember(destination => destination.Bio, options => options.MapFrom(source => source.AppUser.Bio))
                .ForMember(destination=>destination.Image, options=>options.MapFrom(source=>source.AppUser.Photos.FirstOrDefault(x=>x.IsMain).Url))
                .ForMember(destination=>destination.FollowersCount,options=>options.MapFrom(source=>source.AppUser.Followers.Count))
                .ForMember(destination=>destination.FollowingCount,options=>options.MapFrom(source=>source.AppUser.Followings.Count))
                //We need Current userName info from our token. But we cannot inject it in the mappingProfile.
                //The solution will be create a string variable and pass it in the call from the Application List method
                .ForMember(destination=>destination.Following,options=>options.MapFrom(source=>source.AppUser.Followers.Any(x=>x.Observer.UserName==currentUsername)));
                ;
            
            //We need to create a mapping for get the Photos
            CreateMap<AppUser,Profiles.Profile>()
                .ForMember(destination=>destination.Image, options=>options.MapFrom(source=>source.Photos.FirstOrDefault(x=>x.IsMain).Url))
                .ForMember(destination=>destination.FollowersCount,options=>options.MapFrom(source=>source.Followers.Count))
                .ForMember(destination=>destination.FollowingCount,options=>options.MapFrom(source=>source.Followings.Count))
                //We need Current userName info from our token. But we cannot inject it in the mappingProfile.
                //The solution will be create a string variable and pass it in the call from the Application List method
                .ForMember(destination=>destination.Following,options=>options.MapFrom(source=>source.Followers.Any(x=>x.Observer.UserName==currentUsername)));

            //New map for map our new Comments Feature
            //From The comment to the ComentDto
            CreateMap<Comment, CommentDto>()
                .ForMember(destination => destination.DisplayName, options => options.MapFrom(source => source.Author.DisplayName))
                .ForMember(destination => destination.UserName, options => options.MapFrom(source => source.Author.UserName))
                .ForMember(destination=>destination.Image, options=>options.MapFrom(source=>source.Author.Photos.FirstOrDefault(x=>x.IsMain).Url));
            
        }//end constructor MappingProfiles
    }//end class MappingProfile
}//end namespace