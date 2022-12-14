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

namespace Application.Comments
{
    public class List
    {
        public class Query :IRequest<Result<List<CommentDto>>>
        {
            public Guid ActivityId { get; set; }
            
        }//end class Query 

        public class Handler : IRequestHandler<Query, Result<List<CommentDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }//end constructor

            public async Task<Result<List<CommentDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                List<CommentDto> comments=new List<CommentDto>();
                try
                {
                    comments = await _context.Comments
                        .Where(x => x.Activity.Id == request.ActivityId)
                        .OrderByDescending(x => x.CreatedAt)
                        .ProjectTo<CommentDto>(_mapper.ConfigurationProvider)
                        .ToListAsync();

                }//end try
                catch (Exception ex) {
                    return Result<List<CommentDto>>.Failure(String.Format("Error on {0}",ex.Message));
                }//end catch
                

                return Result<List<CommentDto>>.Success(comments);
                        
            }//end Handle
        }//end class Handler
    }//end class List
}//end namespace