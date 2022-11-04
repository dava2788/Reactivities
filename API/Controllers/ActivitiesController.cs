using Domain;
using Microsoft.AspNetCore.Mvc;
using Application.Activities;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers
{

    public class ActivitiesController : BaseApiController
    {
        #region Code for using the CancellationToken EXAMPLE
        // [HttpGet]
        // public async Task<ActionResult<List<Activity>>> GetActivities(CancellationToken ct)
        // {
        //     return await Mediator.Send(new List.Query(),ct);
        // }//end GetActivities
        #endregion

        [HttpGet]
        public async Task<IActionResult> GetActivities()
        {
            return HandleResult( await Mediator.Send(new List.Query()));
        }//end GetActivities

        [HttpGet("{id}")]// Activities/ids
        public async Task<IActionResult> GetActivity(Guid id)
        {
            return HandleResult(await Mediator.Send(new Details.Query{Id=id}));
            
        }//end GetActivity

        [HttpPost]        
        public async Task<IActionResult> CreateActivity(Activity activity)
        {
            return HandleResult(await Mediator.Send(new Create.Command{Activity=activity}));
        }//end CreateActivity

        //This attribute is to use the policy we create in the infrastructure
        //IsHostRequirement and add as well in our IdentityServicesExtensions
        //With this we make sure only the host will be able to EDIT the activity
        [Authorize(Policy ="IsActivityHost")]
        [HttpPut("{id}")]
        public async Task<IActionResult> EditActivity(Guid id, Activity activity)
        {
            activity.Id=id;
            return HandleResult(await Mediator.Send(new Edit.Command{Activity=activity}));
        }//end EditActivity

        //This attribute is to use the policy we create in the infrastructure
        //IsHostRequirement and add as well in our IdentityServicesExtensions
        //With this we make sure only the host will be able to DELETE the activity
        [Authorize(Policy ="IsActivityHost")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command{Id=id}));
        }//end DeleteActivity

        [HttpPost("{id}/attend")]
        public async Task<IActionResult> Attend(Guid id)
        {
            return HandleResult(await Mediator.Send(new UpdateAttendace.Command{Id=id}));
        }//end DeleteActivity

    }//end ActivitiesController

}//end namespace