using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query:IRequest<Result<List<Activity>>>{}//end class Query
        public class Handler : IRequestHandler<Query, Result<List<Activity>>>
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

             public Handler(DataContext context)
            {
                _context = context;
            }//end constructor Handler

            public async Task<Result<List<Activity>>> Handle(Query request, CancellationToken cancellationToken)
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

                return  Result<List<Activity>>.Success(await _context.Activities.ToListAsync());


            }//end Task
        }//end class Handler
    }//end class List
}//end Namespace