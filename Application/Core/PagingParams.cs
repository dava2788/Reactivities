using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Core
{
    public class PagingParams
    {
        private const int MaxPageSize=50;
        public int PageNumber { get; set; }=1;

        private int _pageSise=10;
        //This is for configura manually the Getter and setter
        //The get is the sameas  automatically
        //the set is going to checkl if is lower than the MaxPageSize
        //before set the value
        public int PageSize
        {
            get =>_pageSise;
            set => _pageSise= (value> MaxPageSize) ? MaxPageSize : value;
        }//end PageSize property 
        
        
    }//end class PagingParams
}//end namespace