using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        //This is a Command type class. Query return Data. But command doesn't
        //because it doesn't return anything 
        public class Command:IRequest<Result<Unit>>{
            //This is what we are going to recieved as a parameter

            public Activity Activity { get; set; }

        }//end Command class

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
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }//end Handler Constructor

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                //This method not required to be async
                //Because we are not modifying the DB
                //This modify context only the memory
                _context.Activities.Add(request.Activity);

                var result=await _context.SaveChangesAsync() >0 ? true :false;

                if (!result)
                {
                    return Result<Unit>.Failure("Failed to create Actvity");
                }// end if (!result)

                //We need to return something
                //this Unit.Value is equivalent 
                //to retunr void
                return Result<Unit>.Success(Unit.Value);

            }//end Task

        }//end Handler

    }//end class Create
}//end namespace