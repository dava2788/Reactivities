import React from "react";
import { Grid } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";
import ActivityList from "./ActivityList";
interface Props{
    activities:Activity[];
    selectedActivity:Activity | undefined;
    selectActivity:(id:string)=>void;
    cancelSelectActivity:()=>void;
    editMode:boolean;
    openForm:(id: string)=> void;
    closeForm:()=> void;
    createOrEdit:(activity:Activity)=>void;
    DeleteActivity:(id: string)=> void;
    submitting:boolean;
}

export default function ActivityDashboard({activities,selectedActivity,selectActivity,cancelSelectActivity,editMode,openForm,closeForm,createOrEdit,DeleteActivity,submitting}:Props){
    return(
        <Grid>
            <Grid.Column width='10'>
                <ActivityList activities={activities} selectActivity={selectActivity} DeleteActivity={DeleteActivity} submitting={submitting}/>
            </Grid.Column>
            <Grid.Column width={'6'}>
                {/* This code is for avoid an eror when you cascade the component
                This ActivityDetails component load before get access to the activity object
                doesn't know if activity object exist
                The way to fix is make sure that object exist.
                "selectedActivity &&"  this mean.
                Anything to the right of "&&" will execute if 
                selectedActivity is not null or undefined */}
                {selectedActivity && !editMode &&
                    <ActivityDetails 
                        activity={selectedActivity} 
                        cancelSelectActivity={cancelSelectActivity}
                        openForm={openForm}
                    />
                }
                {editMode && <ActivityForm closeForm={closeForm} activity={selectedActivity} createOrEdit={createOrEdit} submitting={submitting}/>}
            </Grid.Column>
        </Grid>

    );//end return

}//end ActivityDashboard