import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Grid } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponents";
import { useStore } from "../../../app/stores/store";
import ActivityFilters from "./ActivityFilters";

import ActivityList from "./ActivityList";

export default observer(function ActivityDashboard(){
    const {activityStore}=useStore();

    const {loadActitivies,activityRegister}=activityStore
    useEffect(()=>{
        if (activityRegister.size<=1) {
            loadActitivies();
        }//end if (activityRegister.size==0) 
    },[activityRegister.size,loadActitivies]);

    if(activityStore.loadingInitial) {
        return <LoadingComponent content='loading Activities...'></LoadingComponent>
    }//end if(loading)
    else{
        return(
            <Grid>
                <Grid.Column width='10'>
                    <ActivityList/>
                </Grid.Column>
                <Grid.Column width={'6'}>
                    <ActivityFilters/>
                    {/* Th>is code is for avoid an eror when you cascade the component
                    This ActivityDetails component load before get access to the activity object
                    doesn't know if activity object exist
                    The way to fix is make sure that object exist.
                    "selectedActivity &&"  this mean.
                    Anything to the right of "&&" will execute if 
                    selectedActivity is not null or undefined */}
                    {/* {selectedActivity && !editMode && <ActivityDetails/>}
                    {editMode && <ActivityForm />} */}
                </Grid.Column>
            </Grid>

        );//end return
    }//end Else




    

}//end ActivityDashboard
)