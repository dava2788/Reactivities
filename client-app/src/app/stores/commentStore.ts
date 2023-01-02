import { HubConnection } from "@microsoft/signalr";
import { HubConnectionBuilder } from "@microsoft/signalr/dist/esm/HubConnectionBuilder";
import { LogLevel } from "@microsoft/signalr/dist/esm/ILogger";
import { makeAutoObservable, runInAction } from "mobx";
import { ChatComment } from "../models/comment";
import { store } from "./store";

export default class CommentStore{
    comments: ChatComment[]=[];
    hubConnection: HubConnection | null = null;

    constructor(){
        makeAutoObservable(this);
    }//end constructor

    createHubConnection=(activityId:string)=>{
        if (store.activityStore.selectedActivity) {
            this.hubConnection = new HubConnectionBuilder().withUrl(process.env.REACT_APP_CHAT_URL+'?activityId='+activityId,{
                accessTokenFactory: ()=> store.userStore.user?.token!
            })
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();
            
            this.hubConnection.start().catch(error=>
                console.log('Error establing the connection:',error)
                );

            this.hubConnection.on('LoadComments',(comments:ChatComment[])=>{
                runInAction(() => {
                    comments.forEach(comment => {
                        comment.createdAt = new Date(comment.createdAt);
                    });
                    this.comments = comments;
                });
            });//end on LoadComments

            this.hubConnection.on('ReceiveComment',(comment :ChatComment)=>{
                runInAction(() => {
                    comment.createdAt = new Date(comment.createdAt);
                    //This function will add the new comment
                    //at the start of array not at the end
                    this.comments.unshift(comment);
                });
            });//end on ReceiveComment

        }//end if (store.activityStore.selectedActivity) 
    }//end createHubConnection

    stopHubConnection =() =>{
        this.hubConnection?.stop().catch(error=>console.log('Error Stopping the connection:',error));
    }//end stopHubConnection

    clearComments=()=>{
        this.comments=[];
        this.stopHubConnection();
    }//end clearComments

    addComments = async(values:any)=>{
        values.activityId= store.activityStore.selectedActivity?.id;
        try {
            //When we invoke a signalR method need to exactly mathc the mame
            //For this example we are calling the method SendComment in the ChatHub.cs
            //this is a post request
            await this.hubConnection?.invoke('SendComment',values);
            //We will not need to do anymore because we have
            //in the hub Connection we have the method "ReceiveComment"
            //this will get our comments and push it in our array

            
        } catch (error) {
            console.log(error);
        }//end catch

    }//end addComments

}//end CommentStore