export interface Pagination{
    currentPage:number;
    itemsPerPage:number;
    totalItems:number;
    totalPages:number;

}//end Pagination


export class PaginatedResult<T>{
    data:T;
    pagination:Pagination;

    constructor(data:T,pagination:Pagination){
        this.data=data;
        this.pagination=pagination;
    }//end constructor

}//end PaginateResult

export class PagingParams{
    pageNumber:number ;
    pageSize:number;

    constructor(pageNumber=1,pageSize=2){
        this.pageNumber=pageNumber;
        this.pageSize=pageSize;
    }//end constructor

}//end PagingParams

