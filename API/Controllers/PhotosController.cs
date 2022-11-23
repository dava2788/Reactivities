using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Photos;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class PhotosController:BaseApiController
    {
        [HttpPost]
        public async Task<IActionResult>Add([FromForm] Add.Command command)
        {
            return HandleResult(await Mediator.Send(command));

        }//end Add

        [HttpDelete("{id}")]
        public async Task<IActionResult>Delete(string id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command{id=id}));

        }//end Add

        [HttpPost("{id}/SetMain")]
         public async Task<IActionResult>SetMain(string id)
        {
            return HandleResult(await Mediator.Send(new Setmain.Command{Id=id}));

        }//end Add

        

    }//end class PhotosController:BaseApiController
}//end API.Controllers