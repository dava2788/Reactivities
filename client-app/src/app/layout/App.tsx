import React, {  useEffect } from 'react';
import {  Container } from 'semantic-ui-react';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import LoadingComponent from './LoadingComponents';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';
import NavigBar from './NavigBar';
//this an error because the packagae doesn't have a Typescript definition




function App() {
  const {activityStore}= useStore();

  useEffect(()=>{
    activityStore.loadActitivies();
  },[activityStore]);


if(activityStore.loadingInitial) {
  return <LoadingComponent content='loading App'></LoadingComponent>
}//end if(loading)
else{
  return (
    <>
      <NavigBar></NavigBar>
      <Container style={{marginTop:'7em'}}>
        <ActivityDashboard/>
      </Container>
    </>
  );
}//end else

  
}//end function App

//this is for Mobx
export default observer(App);
