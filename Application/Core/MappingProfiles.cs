using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Activities;
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

            CreateMap<ActivityAttendee, Profiles.Profile>()
                .ForMember(d => d.DisplayName, options => options.MapFrom(source => source.AppUser.DisplayName))
                .ForMember(d => d.Username, options => options.MapFrom(source => source.AppUser.UserName))
                .ForMember(d => d.Bio, options => options.MapFrom(source => source.AppUser.Bio));
            
            


        }//end constructor MappingProfiles
    }//end class MappingProfile
}//end namespace