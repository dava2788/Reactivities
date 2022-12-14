using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class ChatHub : Hub
    {
        public IMediator _mediator { get; }
        public ChatHub(IMediator mediator)
        {
            _mediator = mediator;
        }//end ChatHub

        public async Task SendComment(Create.Command command)
        {
            var comment= await _mediator.Send(command);
            //As son we send the comment after this
            //the ReceiveComment will execute and pass the value
            //Any client connected will recieve the comment if is 
            //in the group
            await Clients.Group(command.ActivityId.ToString())
                    .SendAsync("ReceiveComment",comment.Value);

        }//end SendComment

        //We are going to override this method so, any new user will be include to the group
        public override async Task OnConnectedAsync()
        {
            var hpptContext=Context.GetHttpContext();
            //Spelling and case sentitive is very importante
            var activityId= hpptContext.Request.Query["ActivityId"];
            //This is needed only for conected.
            //Automatically a client disconnect SignalR will remove the connection
            await Groups.AddToGroupAsync(Context.ConnectionId, activityId);


            var result =await _mediator.Send(new List.Query{ActivityId=Guid.Parse(activityId)});

            await Clients.Caller.SendAsync("LoadComments",result.Value);
        }//end OnConnectedAsync


    }//end class ChatHub
}//end namespace