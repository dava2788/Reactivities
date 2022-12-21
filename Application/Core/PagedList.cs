using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Application.Core
{
    public class PagedList<T>:List<T>
    {
        public PagedList(IEnumerable<T> items, int count, int pageNumber, int pageSize)
        {
            CurrentPage = pageNumber;
            TotalPages = (int)Math.Ceiling(count/(double)pageSize);
            PageSize = pageSize;
            TotalCount = count;
            AddRange(items);
        }//end constructor

        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }

        //source will be list of items, better said is going to be a query that will go to the database
        //We will get the count before any pagination will be done
        public static async Task<PagedList<T>> CreateAsynct(IQueryable<T> source, int pageNumber, int pageSize)
        {
            //This will make the 1 query to the DB
            var count = await source.CountAsync();
            //this is the 2 query to the db
            //the idea is for example LIST of 12 items and a page size of 10
            //to get the first 10 records (1-1)*10= 0
            //for the 2 page (2-1)*10= 10 
            //with this method we are deffering the execution
            var items = await source.Skip((pageNumber-1)*pageSize).Take(pageSize).ToListAsync();
            return new PagedList<T>(items,count,pageNumber,pageSize);

        }//end CreateAsynct
        
    }//end class PagedList
}//end namespace