using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Profiles;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProfilesController:BaseApiController
    {
       [HttpGet("{username}")] 
       public async Task<IActionResult>GetProfile(string username)
       {
            return HandleResult(await Mediator.Send(new Details.Query{UserName=username}));
       }//end Task<IActionResult>GetProfile(string username)

        [HttpPut]
        public async Task<IActionResult> Edit(Edit.Command command)
        {
            return HandleResult(await Mediator.Send(command));
        }//end Task<IActionResult> Edit(Edit.Command command)

        [HttpGet("{username}/activities")]
        public async Task<IActionResult> GetUserActivities(string username, string Predicate)
        {
            return HandleResult(await Mediator.Send(new ListActivities.Query{UserName=username ,Predicate=Predicate}));
        }//end Task<IActionResult> GetUserActivities(string username, string Predicate)
        
    }//end class ProfilesController:BaseApiController
}//end namespace API.Controllers