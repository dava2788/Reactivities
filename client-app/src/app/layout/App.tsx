import React, {  useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponents';
//this an error because the packagae doesn't have a Typescript definition




function App() {
  const [activities,setActivities] = useState<Activity[]>([]);
  //this code -> Activity| undefined means could be Activity or Undefined
  const [selectedActivity,setSelectedActivity ]= useState<Activity | undefined>(undefined);
  const [editMode,setEditMode]=useState(false);
  const [loading,setLoading]=useState(true);
  const [submitting, setSubmitting]=useState(false);


  useEffect(
    ()=>{
      agent.Activities.list().then(response =>{
        let activities:Activity[]=[];
        response.forEach(activity=>{
          activity.date=activity.date.split('T')[0];
          activities.push(activity);
        });
        setActivities(activities);
        setLoading(false);
      })
    },
  []);

  function handleSelectActivity(id:string){
    setSelectedActivity(activities.find(x=>x.id ===id));

  }//end handleSelectActivity
  
function handleCancelSelectedActivity(){
  setSelectedActivity(undefined);
}//end handleCancelSelectedActivity

function handleFormOpen(id?:string){
  id ? handleSelectActivity(id) : handleCancelSelectedActivity();
  setEditMode(true);
}//end handleFormOpen


function handleFormClose(){
  setEditMode(false);
}//end handleFormClose

function handleCreateOrEditActivity(activity:Activity){
  setSubmitting(true);
  if(activity.id){
    agent.Activities.update(activity)
    .then(()=>{
      setActivities([...activities.filter(x=>x.id !==activity.id),activity]);
      setSelectedActivity(activity);
      setEditMode(false);
      setSubmitting(false);
    });
  }//end if(activity.id)
  else{
    activity.id=uuid();
    agent.Activities.create(activity).then(()=>{
      setActivities([...activities,activity]);
      setSelectedActivity(activity);
      setEditMode(false);
      setSubmitting(false);
    });
  }//end ELSE if(activity.id)
 

}//end handleCreateOrEditActivity

function handleDelete(id:string){
  setSubmitting(true);
  agent.Activities.delete(id).then(()=>{
    setActivities([...activities.filter(x=>x.id !==id)]);
    setSubmitting(false);
  });
  

}//end handleDelete

if(loading) {
  return <LoadingComponent content='loading App'></LoadingComponent>
}//end if(loading)
else{
  return (
    <>
      <NavBar openForm={handleFormOpen}/>
      <Container style={{marginTop:'7em'}}>
        <ActivityDashboard 
          activities={activities} 
          selectedActivity={selectedActivity} 
          selectActivity={handleSelectActivity} 
          cancelSelectActivity={handleCancelSelectedActivity}
          editMode={editMode}
          openForm={handleFormOpen}
          closeForm={handleFormClose}
          createOrEdit={handleCreateOrEditActivity}
          DeleteActivity={handleDelete}
          submitting={submitting}
        />
      </Container>
    </>
  );
}//end else

  
}//end function App

export default App;
