using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Application.Interfaces;

namespace Application.Activities
{
    public class Details
    {
        //This is a Query type class
        //because it return the IRequest<Activity> 
        //Activity class
        public class Query:IRequest<Result<ActivityDto>>{
            //This is what we are going to recieved as a parameter
            public Guid Id { get; set; }

        }//end class Query

        public class Handler : IRequestHandler<Query, Result<ActivityDto>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            
            private readonly IMapper _mapper;
            public Handler(DataContext context,IMapper mapper,IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _mapper = mapper;
                _context = context;
            }//end Constructor Handler

            public async Task<Result<ActivityDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var activity= await _context.Activities
                .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider,new {currentUsername=_userAccessor.GetUserName()})
                .FirstOrDefaultAsync(x=>x.Id ==request.Id);

                return Result<ActivityDto>.Success(activity);
            }//end Task
        }//end class Handler
    }//end class Details
}//end namespacesss