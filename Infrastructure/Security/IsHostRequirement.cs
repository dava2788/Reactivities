using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infrastructure.Security
{
    public class IsHostRequirement:IAuthorizationRequirement
    {
        
    }//end class IsHostRequirement

    public class IsHostRequirementHandler : AuthorizationHandler<IsHostRequirement>
    {
        private readonly DataContext _dbcontext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public IsHostRequirementHandler(DataContext dbcontext,IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _dbcontext = dbcontext;

        }//end IsHostRequirementHandler Constructor

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirement requirement)
        {
            var userId= context.User.FindFirstValue(ClaimTypes.NameIdentifier);

            if(userId==null) return Task.CompletedTask;

            //The Id comes from the request as a string we need to parse it to GUID
            var activityId = Guid.Parse(_httpContextAccessor.HttpContext?.Request.RouteValues.SingleOrDefault(x=> x.Key == "id").Value?.ToString());

            //NOTE: All Db related call need to use el Async
            var attendee=_dbcontext.ActivityAttendees
            .AsNoTracking()
            .SingleOrDefaultAsync(x=>x.AppUserId == userId && x.ActivivityId==activityId)
            .Result;

            if(attendee==null)return Task.CompletedTask;

            if(attendee.IsHost) context.Succeed(requirement);

            return Task.CompletedTask;

        }//end Task
    }//end class IsHostRequirementHandler : AuthorizationHandler<IsHostRequirement>
}//end namespace