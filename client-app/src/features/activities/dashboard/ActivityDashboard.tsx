import { observer } from "mobx-react-lite";
import React from "react";
import { Grid } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";
import ActivityList from "./ActivityList";

export default observer(function ActivityDashboard(){
    const {activityStore}=useStore();
    const{selectedActivity,editMode}=activityStore;
    return(
        <Grid>
            <Grid.Column width='10'>
                <ActivityList/>
            </Grid.Column>
            <Grid.Column width={'6'}>
                {/* This code is for avoid an eror when you cascade the component
                This ActivityDetails component load before get access to the activity object
                doesn't know if activity object exist
                The way to fix is make sure that object exist.
                "selectedActivity &&"  this mean.
                Anything to the right of "&&" will execute if 
                selectedActivity is not null or undefined */}
                {selectedActivity && !editMode && <ActivityDetails/>}
                {editMode && <ActivityForm />}
            </Grid.Column>
        </Grid>

    );//end return

}//end ActivityDashboard
)