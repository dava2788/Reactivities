using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class FollowToggle
    {
        public class Command: IRequest<Result<Unit>>
        {
            public string TargetName { get; set; }
            
        }//end Command

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            public IUserAccessor _UserAccessor { get; set; }
            private readonly DataContext _context;
            public Handler(DataContext context,IUserAccessor userAccessor)
            {
                _context = context;
                _UserAccessor = userAccessor;
            }//end constructor

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var observer= await _context.Users.FirstOrDefaultAsync(x=> x.UserName==_UserAccessor.GetUserName());

                var Target = await _context.Users.FirstOrDefaultAsync(x=>x.UserName==request.TargetName);

                if(Target == null) return null;

                var following = await _context.UserFollowings.FindAsync(observer.Id,Target.Id);

                //If the following doesn't exist add new following
                if (following == null)
                {
                    following= new UserFollowing
                    {
                        Observer=observer,
                        Target= Target
                    };
                    _context.UserFollowings.Add(following);
                }//end if (following == null)
                //If the following does Exist Remove following
                else{
                    _context.UserFollowings.Remove(following);

                }//end ELSE if (following == null)

                var success = await _context.SaveChangesAsync() >0;

                if(success) return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Failure("Faile to Update Following");


            }
        }//end Handler

    }//end FollowToggle
}//end namespace