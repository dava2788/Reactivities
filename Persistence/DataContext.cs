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
        public DbSet<Activity> Activities { get; set; }
        public DbSet<ActivityAttendee>ActivityAttendees{ get; set; }

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



        }//end OnModelCreating

    }//end class DataContext:DbContext
}//end namespace