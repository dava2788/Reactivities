using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;

namespace Application.Profiles
{
    public class Profile
    {
        public string Username { get; set; }
        public string DisplayName { get; set; }
        public string Bio { get; set; }
        public string Image { get; set; }
        public ICollection<Photo> Photos { get; set; }
        //This property is to check if the current Login User
        //When ask for another user profile
        //The current login user is Following this one
        public bool  Following { get; set; }
        public int FollowersCount { get; set; }
        public int FollowingCount { get; set; }
        
    }//end class Profile
}//end namespace