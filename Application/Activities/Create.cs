using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        //This is a Command type class. Query return Data. But command doesn't
        //because it doesn't return anything 
        public class Command:IRequest{
            //This is what we are going to recieved as a parameter

            public Activity Activity { get; set; }

        }//end Command class
        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }//end Handler Constructor

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                //This method not required to be async
                //Because we are not modifying the DB
                //This modify context only the memory
                _context.Activities.Add(request.Activity);

                await _context.SaveChangesAsync();

                //We need to return something
                //this Unit.Value is equivalent 
                //to retunr void
                return Unit.Value;

            }//end Task

        }//end Handler

    }//end class Create
}//end namespace