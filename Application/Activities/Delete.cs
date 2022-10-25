using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Delete
    {
        public class Command :IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }

        }//end class Command

        public class Handler : IRequestHandler<Command,Result<Unit>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;

            }//end constructor Handle

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.Id);

                // if (activity==null)
                // {
                //     return null;
                // }//end if (activity==null)


                _context.Remove(activity);

                var result=await _context.SaveChangesAsync()>0?true:false;

                if (!result)
                {
                    return Result<Unit>.Failure("Falied to delete the activity");
                }

                //We need to return something
                //this Unit.Value is equivalent 
                //to retunr void
                return Result<Unit>.Success(Unit.Value);

            }//end Task
        }//End class Handler

    }//end class Delete
}//end namespace