using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Application.Profiles;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class List
    {
        public class Query:IRequest<Result<List<Profiles.Profile>>>
        {
            public string Predicate { get; set; }
            public string Username { get; set; }

        }//end class Query

        public class Handler : IRequestHandler<Query, Result<List<Profiles.Profile>>>
        {
            private readonly IMapper _mapper;
            private readonly DataContext _context;
            private readonly IUserAccessor _useraccessor;
        
            public Handler(DataContext context, IMapper mapper,IUserAccessor useraccessor)
            {
                _useraccessor = useraccessor;
                _context = context;
                _mapper = mapper;
                        
            }//end constructor

            public async Task<Result<List<Profiles.Profile>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var profiles= new List<Profiles.Profile>();
                switch (request.Predicate)
                {
                    case "followers":
                        profiles = await _context.UserFollowings
                                    .Where(x=>x.Target.UserName==request.Username)
                                    .Select(u=>u.Observer)
                                    .ProjectTo<Profiles.Profile>(_mapper.ConfigurationProvider,new {currentUsername=_useraccessor.GetUserName()})
                                    .ToListAsync();
                        break;

                    case "following":
                        profiles = await _context.UserFollowings
                                    .Where(x=>x.Observer.UserName==request.Username)
                                    .Select(u=>u.Target)
                                    .ProjectTo<Profiles.Profile>(_mapper.ConfigurationProvider,new {currentUsername=_useraccessor.GetUserName()})
                                    .ToListAsync();
                        break;
                }//end switch

                return Result<List<Profiles.Profile>>.Success(profiles);
                
            }//end Task
        }//end Handler

    }//end List
}//end namespace