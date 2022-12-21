using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Extensions;
using Application.Core;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

namespace API.Controllers
{
    // An API Controller make Automatic HTTP 400 Reponses

    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController:ControllerBase
    {
        private IMediator _mediator;

        protected IMediator Mediator => _mediator ??= HttpContext.RequestServices.GetService<IMediator>();

        protected ActionResult HandleResult<T>(Result<T> result){
            if (result==null)
            {
                return NotFound();
                
            }//end if (result==null)

            if (result.IsSuccess && result.Value != null)
            {
                return Ok(result.Value);
            }//end if (result.IsSuccess && result.Value != null)

            if (result.IsSuccess && result.Value == null)
            {
                return NotFound();
            }//end if (result.IsSuccess && result.Value == null)

            return BadRequest(result.Error);

        }//end HandleResult

        protected ActionResult HandlePageResult<T>(Result<PagedList<T>> result){
            if (result==null)
            {
                return NotFound();
                
            }//end if (result==null)

            if (result.IsSuccess && result.Value != null)
            {
                Response.AddPaginationHeader(
                    result.Value.CurrentPage,
                    result.Value.PageSize,
                    result.Value.TotalCount,
                    result.Value.TotalPages
                );
                return Ok(result.Value);
            }//end if (result.IsSuccess && result.Value != null)

            if (result.IsSuccess && result.Value == null)
            {
                return NotFound();
            }//end if (result.IsSuccess && result.Value == null)

            return BadRequest(result.Error);

        }//end HandlePageResult

    }//end class BaseApiController
}//end namespace