import React, { useState,ChangeEvent } from 'react';
import { Button, Form, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";

interface Props{
    activity:Activity | undefined;
    closeForm:()=> void;
    createOrEdit:(activity:Activity)=>void;
}//end interface Props

export default function ActivityForm({activity:selectedActivity,closeForm,createOrEdit}:Props){
    const initialState= selectedActivity ?? {
        id: '',
        title: '',
        date: '',
        description: '',
        category: '',
        city: '',
        venue: '',
    }//end initialState
    const [activity, SetActivity]=useState(initialState);

    function handleSubmit(){
        //console.log(activity);
        createOrEdit(activity);
    }//end handleSubmit

    function handleInputChange(event:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>  ){
        const {name, value}=event.target;
        SetActivity({...activity,[name]:value});

    }//end handleInputChange

    return(
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete='off'>
                {/* You have to match the name of the Form.Input to exactly the same
                case sensitive to the name of the object parameter.
                For example title and activity.title */}
                <Form.Input placeholder='Title' name='title' value={activity.title} onChange={handleInputChange}/>
                <Form.TextArea placeholder='Description' name='description' value={activity.description} onChange={handleInputChange}/>
                <Form.Input placeholder='Category' name='category' value={activity.category} onChange={handleInputChange}/>
                <Form.Input placeholder='Date' name='date' value={activity.date} onChange={handleInputChange}/>
                <Form.Input placeholder='City' name='city' value={activity.city} onChange={handleInputChange}/>
                <Form.Input placeholder='Venue' name='venue' value={activity.venue} onChange={handleInputChange}/>
                <Button floated="right" positive type="submit" content="Submit"/>
                <Button floated="right" type="button" content="Cancel" onClick={closeForm}/>

            </Form>
        </Segment>
    );//end return

}//end ActivityForm