using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Core
{
    public class AppException
    {
        public AppException(int statusCode, string message, string details=null)
        {
            StatusCode = statusCode;
            Message = message;
            Details = details;
        }//end AppException Constructor

        public int StatusCode { get; set; }
        public string Message { get; set; }
        public string Details { get; set; }
    }//end class AppException
}//end namespace Application.Core