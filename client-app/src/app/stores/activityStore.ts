import { format } from "date-fns";
import {makeAutoObservable, runInAction} from "mobx"
import agent from "../api/agent";
import { Activity } from "../models/activity"

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
        activity.date=new Date(activity.date!);
        this.activityRegister.set(activity.id,activity);
    }//end setActivity

    private getActivity=(id:string)=>{
        return this.activityRegister.get(id);
    }//end getActivity

    setLoadingInitial=(state:boolean)=>{
        this.loadingInitial=state;
    }//end setLoadingInitial

    createActivity=async(activity:Activity)=>{
        this.loading=true;
        try {
            await agent.Activities.create(activity);
            runInAction(()=>{
                this.activityRegister.set(activity.id, activity);
                this.selectedActivity=activity;
                this.editMode=false;
                this.loading=false;
            });//end runInAction
        }//end try
        catch (error) {
            console.log(error);
            runInAction(()=>{
                this.loading=false;
            });//end runInAction
        }//end catch
    }//end createActivity

    updateActivity=async(activity:Activity)=>{
        this.loading=true;
        try {
            await agent.Activities.update(activity);
            runInAction(()=>{
                this.activityRegister.set(activity.id,activity);
                this.selectedActivity=activity;
                this.editMode=false;
                this.loading=false;
            });//end runInAction
        }//end try
        catch (error) {
            console.log(error);
            runInAction(()=>{
                this.loading=false;
            });//end runInAction
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

}//end class ActivityStore