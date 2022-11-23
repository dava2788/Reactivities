using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class Details
    {
        //Needs to be a Query class because is going to 
        //return data
        public class Query:IRequest<Result<Profile>>
        {
           public string UserName { get; set; } 

        }//end class Query:IRequest<Result<Profile>>
        public class Handler : IRequestHandler<Query, Result<Profile>>
        {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
            public Handler(DataContext context,IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }//end Handler constructor

            public async Task<Result<Profile>> Handle(Query request, CancellationToken cancellationToken)
            {
                var user= await _context.Users
                    .ProjectTo<Profile>(_mapper.ConfigurationProvider)
                    .SingleOrDefaultAsync(x=>x.Username==request.UserName);
                
                if (user==null) return null;

                return Result<Profile>.Success(user);

                
            }//end  Task<Result<Profile>> Handle
        }//end class Handler

    }//end class Details
}//end namespace Application.Profiles