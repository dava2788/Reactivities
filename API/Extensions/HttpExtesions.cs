using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace API.Extensions
{
    public static class HttpExtesions
    {
        public static void AddPaginationHeader(this HttpResponse response, int currentPage, int itemsPerPage, int totalItems, int totalPages)
        {
            var paginationHeader= new
            {                
                currentPage,
                itemsPerPage,
                totalItems,
                totalPages
            };

            response.Headers.Add("Pagination", JsonSerializer.Serialize(paginationHeader));
            
            #region Old way to expose the header
            //Because now we are exposing the Pagination Header form the applicationServiceExtension
            //this code below is not necessary
            //This is to expose the new header
            // response.Headers.Add("Access-Control-Expose-Headers","Pagination");
            #endregion

             
        }//end AddPaginationHeader
        
    }//end class HttpExtesions
}//end namespace