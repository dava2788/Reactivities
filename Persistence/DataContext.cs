using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options)
        {

        }//end constructor
        //DbSet For Activities
        public DbSet<Activity> Activities { get; set; }
        //DbSet For ActivityAttendees 
        public DbSet<ActivityAttendee>ActivityAttendees{ get; set; }
        //DbSet For Photos , the table name will get the name for
        //here
        public DbSet<Photo>Photos{ get; set; }
        //DBSet for Comments
         public DbSet<Comment> Comments { get; set; }
         public DbSet<UserFollowing> UserFollowings { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ActivityAttendee>(x=> x.HasKey(aa=>new {aa.AppUserId,aa.ActivivityId}));

            builder.Entity<ActivityAttendee>()
            .HasOne(u=>u.AppUser)
            .WithMany(a=>a.Activities)
            .HasForeignKey(aa=>aa.AppUserId);

             builder.Entity<ActivityAttendee>()
            .HasOne(u=>u.Activity)
            .WithMany(a=>a.Attendees)
            .HasForeignKey(aa=> aa.ActivivityId);

            builder.Entity<Comment>()
            .HasOne(a=>a.Activity)
            .WithMany(c=>c.Comments)
            .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<UserFollowing>(builder=>
            {
                builder.HasKey(key=>new {key.ObserverId,key.TargetId});
                //this is for create the one to many relationship
                builder.HasOne(options=>options.Observer)
                    .WithMany(f=>f.Followings)
                    .HasForeignKey(opt=>opt.ObserverId)
                    .OnDelete(DeleteBehavior.Cascade);

                builder.HasOne(options=>options.Target)
                    .WithMany(f=>f.Followers)
                    .HasForeignKey(opt=>opt.TargetId)
                    .OnDelete(DeleteBehavior.Cascade); 

            });
            

        }//end OnModelCreating

    }//end class DataContext:DbContext
}//end namespace