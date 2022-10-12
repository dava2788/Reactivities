using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Details
    {
        //This is a Query type class
        //because it return the IRequest<Activity> 
        //Activity class
        public class Query:IRequest<Activity>{
            //This is what we are going to recieved as a parameter
            public Guid Id { get; set; }

        }//end class Query

        public class Handler : IRequestHandler<Query, Activity>
        {
            public DataContext _context { get; }
            public Handler(DataContext context)
            {
                _context = context;
            }//end Constructor Handler

            public async Task<Activity> Handle(Query request, CancellationToken cancellationToken)
            {
                return await _context.Activities.FindAsync(request.Id);
            }//end Task
        }//end class Handler
    }//end class Details
}//end namespace