import {makeAutoObservable, runInAction} from "mobx"
import agent from "../api/agent";
import { Activity } from "../models/activity"
import {v4 as uuid} from 'uuid';

export default class ActivityStore{
    activityRegister=new Map<string,Activity>();
    selectedActivity:Activity | undefined=undefined;
    editMode=false;
    loading=false;
    loadingInitial=true;

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
                Date.parse(a.date)-Date.parse(b.date));
    }//end activitiesByDate

    loadActitivies = async ()=>{
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
            //this is for the 
            
            activities.forEach(activity=>{
                activity.date=activity.date.split('T')[0];
                this.activityRegister.set(activity.id,activity);
                }
            );//end Forach

            this.setLoadingInitial(false);
            
        }//end try
        catch(error){
            console.log(error);
            this.setLoadingInitial(false);
        }//end catch
    }//end loadAcitivies

    setLoadingInitial=(state:boolean)=>{
        this.loadingInitial=state;
    }//end setLoadingInitial

    selectActivity=(id:string)=>{
        this.selectedActivity=this.activityRegister.get(id);
    }//end selectActivity

    cancelselectedActivity=()=>{
        this.selectedActivity=undefined;
    }//end cancelselectActivity

    //? mark is for optional
    openForm=(id ?: string) => {
        id? this.selectActivity(id): this.cancelselectedActivity();
        this.editMode=true;
    }//end openForm
   
    closeForm=()=>{
        this.editMode=false;
    }//end closeForm

    createActivity=async(activity:Activity)=>{
        this.loading=true;
        activity.id=uuid();
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
                if(this.selectedActivity?.id===id) {this.cancelselectedActivity();}
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