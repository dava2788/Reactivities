using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Edit
    {
        public class Command:IRequest<Result<Unit>>
        {
            public Activity Activity { get; set; }
        }//end Command

        // Create a middleWare for Error Handler
        public class CommadValidator : AbstractValidator<Command>
        {
            public CommadValidator()
            {
                RuleFor(x=>x.Activity).SetValidator(new ActivityValidator());
            }//end Constructor CommadValidator
        }//end CommadValidator

        public class Handler : IRequestHandler<Command,Result<Unit>>
        {
        public DataContext _context { get; }
        public IMapper _mapper { get; }
            public Handler(DataContext context,IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }//end Handler Constructor

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.Activity.Id);
                //This means if the request.Activity.Title is NUll will use the activity.Title
                //activity.Title= request.Activity.Title ?? activity.Title;
                if (activity ==null)
                {
                    return null;
                }//end if (activity ==null)

                //This is from which object to get the info
                //and which object to set  the info
                _mapper.Map(request.Activity,activity);

                var result =await _context.SaveChangesAsync() >0 ? true : false;

                if (!result)
                {
                    return Result<Unit>.Failure("Failed ot update activity");
                }//if (!result)

    
                //We need to return something
                //this Unit.Value is equivalent 
                //to retunr void
                return Result<Unit>.Success(Unit.Value);

            }//end Task
        }//end Handler 

    }//end class Edit
}//end namespace