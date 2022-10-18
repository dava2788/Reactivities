import React from "react";
import { Button, Card, Image } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponents";
import { useStore } from "../../../app/stores/store";


export default function ActivityDetails(){
    const {activityStore}= useStore();
    const{selectedActivity :activity,openForm,cancelselectedActivity}=activityStore;

    if(!activity){
        return <LoadingComponent content='loading App'></LoadingComponent>;
    }//end  if(!activity){
    else{
        return(
            <Card fluid>
                <Image src={`/assets/categoryImages/${activity.category}.jpg`}/>
                <Card.Content>
                <Card.Header>{activity.title}</Card.Header>
                <Card.Meta>
                    <span>{activity.date}</span>
                </Card.Meta>
                <Card.Description>
                    {activity.description}
                </Card.Description>
                </Card.Content>
                <Card.Content extra>
                <Button.Group widths='2'>
                    <Button basic color='blue' content='Edit' onClick={()=>openForm(activity.id)}/>
                    {/* Because the cancelSelectActivity doesn't have any parameters. We can used this way */}
                    <Button basic color='grey' content='Cancel' onClick={cancelselectedActivity}/>
                </Button.Group>
                </Card.Content>
            </Card>
        );//end return
    }//end ELSE  if(!activity){
    
}//end ActivityDetails