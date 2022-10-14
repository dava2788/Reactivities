import React, { SyntheticEvent, useState } from "react";
import { Button, Item, Label, Segment } from "semantic-ui-react";
import { SyntheticExpression } from "typescript";
import { Activity } from "../../../app/models/activity";

interface Props{
    activities:Activity[];
    selectActivity:(id:string)=>void;
    DeleteActivity:(id: string)=> void;
    submitting:boolean;
}//end interface Props

export default function ActivityList({activities,selectActivity,DeleteActivity,submitting}:Props){
    const [target,setTarget]= useState('');
    function handleActivityDelete(e:SyntheticEvent<HTMLButtonElement>,id:string){
        setTarget(e.currentTarget.name);
        DeleteActivity(id);
    }//end handleActivityDelete

    return(
        <Segment>
            <Item.Group divided >
                {activities.map(activity=>(
                    <Item key={activity.id}>
                        <Item.Content>
                            <Item.Header as='a'>{activity.title}</Item.Header>
                            <Item.Meta>{activity.date}</Item.Meta>
                            <Item.Description>
                                <div>{activity.description}</div>
                                <div>{activity.city},{activity.venue}</div>
                            </Item.Description>
                            <Item.Extra>
                                 {/* When the button is render (without the array function) will execute as soon it's render
                                 that is why we use the array funcion, to wait the button is click for execute */}
                                <Button floated="right" content='View' color="blue"
                                    onClick={()=>selectActivity(activity.id)}
                                />
                                <Button floated="right" content='Delete' color="red"
                                    onClick={(e)=>handleActivityDelete(e,activity.id)} 
                                    loading={submitting && target ==activity.id} 
                                    name={activity.id}
                                />
                                <Label basic content={activity.category}/>
                            </Item.Extra>
                        </Item.Content>

                    </Item>
                ))}
            </Item.Group>
        </Segment>
    );//end return
}//end ActivityList