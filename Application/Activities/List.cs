using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;
using AutoMapper.QueryableExtensions;

namespace Application.Activities
{
    public class List
    {
        public class Query:IRequest<Result<List<ActivityDto>>>{}//end class Query
        public class Handler : IRequestHandler<Query, Result<List<ActivityDto>>>
        {
        public DataContext _context { get; }

        #region Code for using the CancellationToken EXAMPLE
        // public ILogger<List> _logger { get; }
        //     public Handler(DataContext context,ILogger<List> logger)
        //     {
        //         _logger = logger;
        //         _context = context;
        //     }//end constructor Handler

        #endregion
        public IMapper _Mapper { get; }

             public Handler(DataContext context,IMapper mapper)
            {
                _Mapper = mapper;
                _context = context;
            }//end constructor Handler

            public async Task<Result<List<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                #region Code for using the CancellationToken EXAMPLE
                //Code for using the CancellationToken
                // try{
                //     for(var i=0;i<10;i++){
                //         cancellationToken.ThrowIfCancellationRequested();
                //         await Task.Delay(1000, cancellationToken);
                //         _logger.LogInformation($"Task {i} has completed");
                //     }//end for

                // }//end try
                // catch(Exception ex) when(ex is TaskCanceledException){
                //     _logger.LogInformation("Task was cancelled");

                // }//end catch
                // return await _context.Activities.ToListAsync(cancellationToken);
                #endregion

                //This code es for the Method name "Eagerly Loading" for Load Related Entities
                //The issue is the select query auto generated
                //With much no need columns
                // var Activities= await _context.Activities
                //             .Include(a=>a.Attendees)
                //             .ThenInclude(u=>u.AppUser)
                //             .ToListAsync();
                //For +Mapper.Map you first configure the mapp To you want "List<ActivityDto>"
                //then the from in this case (activities)
                // var activitiesToReturn=_Mapper.Map<List<ActivityDto>>(Activities);

                //this code is for using projection for load related entities
                //With this we wil get a cleaner select SQL query with only the 
                //data we ned
                var Activities= await _context.Activities
                            .ProjectTo<ActivityDto>(_Mapper.ConfigurationProvider)
                            .ToListAsync();

                

                return  Result<List<ActivityDto>>.Success(Activities);


            }//end Task
        }//end class Handler
    }//end class List
}//end Namespace