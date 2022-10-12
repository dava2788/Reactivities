using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Edit
    {
        public class Command:IRequest
        {
            public Activity Activity { get; set; }
        }//end Command

        public class Handler : IRequestHandler<Command>
        {
        public DataContext _context { get; }
        public IMapper _mapper { get; }
            public Handler(DataContext context,IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }//end Handler Constructor

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.Activity.Id);
                //This means if the request.Activity.Title is NUll will use the activity.Title
                //activity.Title= request.Activity.Title ?? activity.Title;

                //This is from which object to get the info
                //and which object to set  the info
                _mapper.Map(request.Activity,activity);

                await _context.SaveChangesAsync();


                //We need to return something
                //this Unit.Value is equivalent 
                //to retunr void
                return Unit.Value;

            }//end Task
        }//end Handler 

    }//end class Edit
}//end namespace