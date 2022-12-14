import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import {  Grid } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponents";
import { useStore } from "../../../app/stores/store";
import ActivityDetailedChat from "./ActivityDetailedChat";
import ActivityDetailedHeader from "./ActivityDetailedHeader";
import ActivityDetailedInfo from "./ActivityDetailedInfo";
import ActivityDetailedSideBar from "./ActivityDetailedSideBar";


export default observer (function ActivityDetails(){
    const {activityStore}= useStore();
    const{selectedActivity :activity,loadActitivy,loadingInitial,clearSelectedActivity}=activityStore;
    //this is for get the Id pass by the URL
    const {id}=useParams<{id:string}>();

    useEffect(()=>{
        if (id) {
            loadActitivy(id);
        }//if (id) 
        //the idea is clear the clearSelectedActivity of memory
        //For do not affect the SignalR 
        //section 19 video 219
        return ()=>clearSelectedActivity();
    },[id,loadActitivy,clearSelectedActivity]);

    if(loadingInitial|| !activity){
        return <LoadingComponent content='loading App'></LoadingComponent>;
    }//end  if(!activity){
    else{
        return(
            <Grid>
                <Grid.Column width={10}>
                    <ActivityDetailedHeader activity={activity}/>
                    <ActivityDetailedInfo activity={activity}/>
                    <ActivityDetailedChat activityId={activity.id}/>
                </Grid.Column>
                <Grid.Column width={6}>
                    <ActivityDetailedSideBar activity={activity} />
                </Grid.Column>
            </Grid>
        );//end return
    }//end ELSE  if(!activity){
    
}//end ActivityDetails
)