using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Delete
    {
        public class Command :IRequest
        {
            public Guid Id { get; set; }

        }//end class Command

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;

            }//end constructor Handle

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.Id);

                _context.Remove(activity);

                await _context.SaveChangesAsync();

                //We need to return something
                //this Unit.Value is equivalent 
                //to retunr void
                return Unit.Value;

            }//end Task
        }//End class Handler

    }//end class Delete
}//end namespace