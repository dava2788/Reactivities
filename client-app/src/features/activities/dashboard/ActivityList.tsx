import React, { Fragment } from "react";
import { observer } from 'mobx-react-lite';
import {  Header} from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import ActivityListItem from './ActivityListItem';


export default observer( function ActivityList(){
    const {activityStore}= useStore();
    const{groupActivities}=activityStore;

    return(
        <>
            {/* Remenber the Map function, using arrow funcion especte curly brackets () */}
            {groupActivities.map(([group,activities]) =>(
                <Fragment key={group}>
                    <Header sub color="teal">
                        {group}
                    </Header>
                        {activities.map(activity=>(
                            <ActivityListItem activity={activity} key={activity.id}/>
                        ))}
                </Fragment>
            ))}
        </>
    );//end return
}//end ActivityList
)