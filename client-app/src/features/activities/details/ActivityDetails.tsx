import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Button, Card, Image } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponents";
import { useStore } from "../../../app/stores/store";


export default observer (function ActivityDetails(){
    const {activityStore}= useStore();
    const{selectedActivity :activity,loadActitivy,loadingInitial}=activityStore;
    //this is for get the Id pass by the URL
    const {id}=useParams<{id:string}>();

    useEffect(()=>{
        if (id) {
            loadActitivy(id);
        }//if (id) 
    },[id,loadActitivy]);

    if(loadingInitial|| !activity){
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
                    <Button basic color='blue' content='Edit' as={Link} to={`/manage/${activity.id}`}/>
                    {/* Because the cancelSelectActivity doesn't have any parameters. We can used this way */}
                    <Button basic color='grey' content='Cancel' as={Link} to={'/activities'} />
                </Button.Group>
                </Card.Content>
            </Card>
        );//end return
    }//end ELSE  if(!activity){
    
}//end ActivityDetails
)