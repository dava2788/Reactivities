using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class Setmain
    {
        public class Command:IRequest<Result<Unit>>
        {
            public string Id { get; set; }

        }//end class Command:IRequest<Result<int>>

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
        private readonly DataContext _context;
        public IUserAccessor _UserAccessor { get; set; }
            public Handler(DataContext context,IUserAccessor userAccessor)
            {
                _UserAccessor = userAccessor;
                _context = context;
            }//end Handler constructor

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                //For this call we need the Photo collection
                //We need the Eagle loading again
                var user = await _context.Users.Include(p=> p.Photos).FirstOrDefaultAsync(x=>x.UserName == _UserAccessor.GetUserName());
                
                if (user ==null) return null;

                var photo= user.Photos.FirstOrDefault(x=>x.id==request.Id);

                if (photo ==null) return null;

                var currentMain=user.Photos.FirstOrDefault(x=>x.IsMain);

                if (currentMain !=null) currentMain.IsMain=false;

                photo.IsMain=true;

                var success= await _context.SaveChangesAsync()>0;

                if(success) return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Failure("Problem setting Main Photo");

            }//end Task<Result<int>>
            
        }//end class Handler : IRequestHandler<Command, Result<int>>


    }//end class Setmain
}//end Application.Photos