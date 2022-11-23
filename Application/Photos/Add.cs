using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class Add
    {
        public class Command:IRequest<Result<Photo>>
        {
            //This property name is important
            public IFormFile File { get; set; }
        }//end class Command:IRequest<Result<Photo>>

        public class Handler : IRequestHandler<Command, Result<Photo>>
        {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;
        private readonly IPhotoAccessor _photoAccessor;
            public Handler(DataContext context,IPhotoAccessor photoAccessor,IUserAccessor userAccessor )
            {
                _photoAccessor = photoAccessor;
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Result<Photo>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user= await _context.Users.Include(p=>p.Photos).FirstOrDefaultAsync(x=>x.UserName==_userAccessor.GetUserName());
                if (user == null || request.File== null) return null;

                //if this doesn't work we will get an exception
                var photoUploadResult= await _photoAccessor.AddPhoto(request.File);

                var photo = new Photo
                {
                    Url=photoUploadResult.Url,
                    id=photoUploadResult.PublicId
                };

                if (!user.Photos.Any(x=>x.IsMain)) photo.IsMain=true;
                
                user.Photos.Add(photo);

                var Result= await _context.SaveChangesAsync() >0;

                //if there is a result
                if (Result) return Result<Photo>.Success(photo);
                //if not well
                return Result<Photo>.Failure("Problem Adding photo");
                
            }//end Task
            
        }//end class Handler : IRequestHandler<Command, Result<Photo>>
    }//end public class Add
}//end namespace Application.Photos