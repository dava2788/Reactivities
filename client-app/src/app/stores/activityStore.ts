import { format } from "date-fns";
import {makeAutoObservable, runInAction} from "mobx"
import agent from "../api/agent";
import { Activity, ActivityFormValues } from "../models/activity"
import { Profile } from "../models/profile";
import { store } from "./store";

export default class ActivityStore{
    activityRegister=new Map<string,Activity>();
    selectedActivity:Activity | undefined=undefined;
    editMode=false;
    loading=false;
    loadingInitial=false;

    constructor(){
        makeAutoObservable(this)

        //with using the autoObservavle
        //You will need to especify 
        //which properties will be
        //observable or action
        // makeObservable(this,{
        //     title:observable,
        //     setTitle:action
        // })//end makeObservable

    }//end constructor

    get activitiesByDate(){
        return Array.from(this.activityRegister.values()).sort((a,b)=>
                a.date!.getTime()-b.date!.getTime());
    }//end activitiesByDate

    get groupActivities(){
        return Object.entries(
            this.activitiesByDate.reduce((activities,activity)=>{
                const date=format(activity.date!,'dd MMM yyyy');
                activities[date]=activities[date] ?[...activities[date],activity] : [activity] ;
                return activities;
            },{} as {[key:string] : Activity[]})//end reduce
        );//end return
    }//end groupActivities

    loadActitivies = async ()=>{
        this.setLoadingInitial(true);
        //syncronize code will be outside the 
        //try/catch bloack
        //this.setLoadingInitial(true);
        //All async code will be contain the 
        //try/catch bloack
        try{ 
            //This line with the await will
            //wait until we have something in the activities []
            //before continue with the next line
            const activities= await agent.Activities.list();
             
            activities.forEach(activity=>{
                this.setActivity(activity);
                }
            );//end Forach

            this.setLoadingInitial(false);
            
        }//end try
        catch(error){
            console.log(error);
            this.setLoadingInitial(false);
        }//end catch
    }//end loadAcitivies

    loadActitivy=async(id:string)=>{
        let activity=this.getActivity(id);
        if(activity){
            this.selectedActivity=activity;
            return activity;
        }//end if(activity)
        else{
            this.loadingInitial=true;
            try {
                activity=await agent.Activities.details(id);
                this.setActivity(activity);
                runInAction(()=>{
                    this.selectedActivity=activity;
                })//end runInAction
                
                this.setLoadingInitial(false);
                return activity;
             }//end try
            catch (error) {
                console.log(error);
                this.setLoadingInitial(false);
            }//end catch

        }//end ELSE if(activity)
    }//end loadActitivy

    private setActivity=(activity:Activity)=>{
        const user = store.userStore.user;
        if (user) {
            activity.isGoing = activity.attendees!.some(a=>a.username===user.username);
            activity.isHost = activity.hostUsername===user.username;
            activity.host = activity.attendees?.find(x=>x.username===activity.hostUsername);
        }//end if (user) 
        activity.date=new Date(activity.date!);
        this.activityRegister.set(activity.id,activity);
    }//end setActivity

    private getActivity=(id:string)=>{
        return this.activityRegister.get(id);
    }//end getActivity

    setLoadingInitial=(state:boolean)=>{
        this.loadingInitial=state;
    }//end setLoadingInitial

    createActivity=async(activity:ActivityFormValues)=>{
        const user = store.userStore.user;
        const attendee= new Profile(user!);
        try {
            await agent.Activities.create(activity);
            const newActivity= new Activity(activity);
            newActivity.hostUsername=user!.username;
            newActivity.attendees=[attendee];
            this.setActivity(newActivity);

            runInAction(()=>{
                this.selectedActivity=newActivity;
            });//end runInAction
        }//end try
        catch (error) {
            console.log(error);
            
        }//end catch
    }//end createActivity

    updateActivity=async(activity:ActivityFormValues)=>{
        this.loading=true;
        try {
            await agent.Activities.update(activity);
            runInAction(()=>{
                if (activity.id) {
                    let updatedActivity={...this.getActivity(activity.id),...activity};
                    this.activityRegister.set(activity.id,updatedActivity as Activity);
                    this.selectedActivity=updatedActivity as Activity;
                }//end if (activity.id) 
                
                
            });//end runInAction
        }//end try
        catch (error) {
            console.log(error);
        }//end catch

    }//end updateActivity

    deleteActivity=async(id:string)=>{
        this.loading=true;
        try {
            await agent.Activities.delete(id);
            runInAction(()=>{
                this.activityRegister.delete(id);
                this.loading=false;
            });//end runInAction
        }//end try
        catch (error) {
            console.log(error);
            runInAction(()=>{
                this.loading=false;
            });//end runInAction
        }//end catch
    }//end deleteActivity

    updateAttendace=async()=>{
        const user = store.userStore.user;
        this.loading=true;
        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(()=>{
                if (this.selectedActivity?.isGoing) {
                    this.selectedActivity.attendees= this.selectedActivity.attendees?.filter(a=>a.username !== user?.username);
                    this.selectedActivity.isGoing=false;
                }//end if (this.selectedActivity?.isGoing) 
                else{
                    const attendee=new Profile(user!);
                    this.selectedActivity?.attendees?.push(attendee);
                    this.selectedActivity!.isGoing=true;

                }//end ELSE if (this.selectedActivity?.isGoing) 
                this.activityRegister.set(this.selectedActivity!.id,this.selectedActivity!);

            });
        } catch (error) {
            console.log(error);
        }finally{
            runInAction(()=>this.loading=false);
        }//end finally
    }//end updateAttendace

    cancelActivityToggle=async()=>{
        this.loading=true;
        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(()=>{
                this.selectedActivity!.isCancelled=!this.selectedActivity?.isCancelled;
                this.activityRegister.set(this.selectedActivity!.id,this.selectedActivity!);
            });
        } catch (error) {
            console.log(error);
        }finally{
            runInAction(()=>this.loading=false);

        }//end finally
    }//end cancelActivity

    clearSelectedActivity = () =>{
        this.selectedActivity =undefined;
    }//end clearSelectedActivity

}//end class ActivityStore