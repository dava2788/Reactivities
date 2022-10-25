import React from 'react';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import { Route, Routes, useLocation } from 'react-router-dom';
import ActivityForm from '../../features/activities/form/ActivityForm';
import HomePage from '../../features/home/HomePage';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import Layout from './Layout';
import TestErrors from '../../features/errors/TestErrors';
import { ToastContainer } from 'react-toastify';
import NotFound from '../../features/errors/NotFound';
import ServerError from '../../features/errors/ServerError';




function App() {
  const location=useLocation();
  
    return (
      <>
      <ToastContainer position='bottom-right' hideProgressBar/>
        <Routes>
          <Route path='/' element={<HomePage/>} /> 
          <Route  element={<Layout/>}>
            <Route path='/activities'  element={<ActivityDashboard/>}/>
            <Route path='/activities/:id' element={<ActivityDetails/>}/>
            {["/createActivity", "/manage/:id"].map((path) => {
              return (
                <Route key={location.key} path={path} element={<ActivityForm key={location.key} />} />
              );
            })}
            <Route path='/errors' element={<TestErrors/>}/> 
            <Route path='*' element={<NotFound />} />
            <Route path='/Server-Error' element={<ServerError />} />
          </Route> 
        </Routes>
      </>
    );

}//end function App

//this is for Mobx
export default observer(App);
