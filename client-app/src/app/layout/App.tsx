import React, {  useEffect, useState } from 'react';
import axios from 'axios';
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid';
//this an error because the packagae doesn't have a Typescript definition




function App() {
  const [activities,setActivities] = useState<Activity[]>([]);
  //this code -> Activity| undefined means could be Activity or Undefined
  const [selectedActivity,setSelectedActivity ]= useState<Activity | undefined>(undefined);

  const [editMode,setEditMode]=useState(false);


  useEffect(
    ()=>{
    axios.get<Activity[]>('http://localhost:5000/api/Activities').then(response =>{
      setActivities(response.data);
    })
  },[]);

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
  activity.id 
  ? setActivities([...activities.filter(x=>x.id !==activity.id),activity])
  : setActivities([...activities, {...activity,id:uuid()}]);
  setEditMode(false);
  setSelectedActivity(activity);

}//end handleCreateOrEditActivity

function handleDelete(id:string){
  setActivities([...activities.filter(x=>x.id !==id)]);

}//end handleDelete

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
        />
      </Container>
    </>
  );
}

export default App;
