import React from 'react';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import { Route, Routes, useLocation } from 'react-router-dom';
import ActivityForm from '../../features/activities/form/ActivityForm';
import HomePage from '../../features/home/HomePage';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import Layout from './Layout';

function App() {
  const location=useLocation();
  
    return (
      <>
        <Routes>
          <Route path='/' element={<HomePage/>} /> 
          <Route path='' element={<Layout/>}>
            <Route path='/activities'  element={<ActivityDashboard/>}/>
            <Route path='/activities/:id' element={<ActivityDetails/>}/>
            {["/createActivity", "/manage/:id"].map((path) => {
              return (
                <Route key={location.key} path={path} element={<ActivityForm key={location.key} />} />
              );
            })}
          </Route> 
        </Routes>
      </>
    );

}//end function App

//this is for Mobx
export default observer(App);
