import { observer } from 'mobx-react-lite';
import React, { useState,ChangeEvent, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Form, Segment } from "semantic-ui-react";
import LoadingComponent from '../../../app/layout/LoadingComponents';
import { useStore } from '../../../app/stores/store';
import {v4 as uuid} from 'uuid';
import { Link } from 'react-router-dom';



export default observer(function ActivityForm(){
    const navigate=useNavigate();
    const {activityStore}= useStore();
    const{createActivity,updateActivity,loading,loadActitivy,loadingInitial}=activityStore;
    const{id} =useParams<{id: string}>();

    const [activity, SetActivity]=useState({
        id: '',
        title: '',
        date: '',
        description: '',
        category: '',
        city: '',
        venue: '',
    });
   
    useEffect(()=>{
        if (id) {
            loadActitivy(id).then(activity=>SetActivity(activity!));
        }//end  if (id)
    },[id,loadActitivy]);//end useEffect

    function handleSubmit(){
        if(activity.id.length===0){
            let newActivity={
                ...activity,
                id:uuid()
            };//end newActivity
            createActivity(newActivity).then(()=>{
                navigate(`/activities/${newActivity.id}`)
            });//end createActivity.then
        }//end if(activity.id.length===0)
        else{
            updateActivity(activity).then(() => navigate(`/activities/${activity.id}`))
        }//end ELSE if(activity.id.length===0)

    }//end handleSubmit

    function handleInputChange(event:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>  ){
        const {name, value}=event.target;
        SetActivity({...activity,[name]:value});

    }//end handleInputChange

    if (loadingInitial) {
        return <LoadingComponent content='Loading Activity'></LoadingComponent>
    }//end if else
    else{
        return(
            <Segment clearing>
                <Form onSubmit={handleSubmit} autoComplete='off'>
                    {/* You have to match the name of the Form.Input to exactly the same
                    case sensitive to the name of the object parameter.
                    For example title and activity.title */}
                    <Form.Input placeholder='Title' name='title' value={activity.title} onChange={handleInputChange}/>
                    <Form.TextArea placeholder='Description' name='description' value={activity.description} onChange={handleInputChange}/>
                    <Form.Input placeholder='Category' name='category' value={activity.category} onChange={handleInputChange}/>
                    <Form.Input type='date' placeholder='Date' name='date' value={activity.date} onChange={handleInputChange}/>
                    <Form.Input placeholder='City' name='city' value={activity.city} onChange={handleInputChange}/>
                    <Form.Input placeholder='Venue' name='venue' value={activity.venue} onChange={handleInputChange}/>
                    <Button floated="right" positive type="submit" content="Submit" loading={loading}/>
                    <Button floated="right" type="button" content="Cancel" as={Link} to={`/activities`}/>
                </Form>
            </Segment>
        );//end return
    }//end ELSE if (loadingInitial)
}//end ActivityForm
)//end observer