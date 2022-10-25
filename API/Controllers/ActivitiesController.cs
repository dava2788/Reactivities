using Domain;
using Microsoft.AspNetCore.Mvc;
using Application.Activities;

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

        [HttpPut("{id}")]
        public async Task<IActionResult> EditActivity(Guid id, Activity activity)
        {
            activity.Id=id;
            return HandleResult(await Mediator.Send(new Edit.Command{Activity=activity}));
        }//end EditActivity

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command{Id=id}));
        }//end DeleteActivity

    }//end ActivitiesController

}//end namespace