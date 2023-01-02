import React from 'react';
import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Outlet, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import { ToastContainer } from 'react-toastify';
import { useStore } from '../stores/store';
import LoadingComponent from './LoadingComponents';
import ModalContainer from '../common/modals/ModalContainer';
import NavigBar from './NavigBar';
import { Container } from 'semantic-ui-react';
import ScrollToTop from './ScrollToTop';


function App() {

  const location=useLocation();
  const {commonStore,userStore}=useStore();
  useEffect(()=>{
    if (commonStore.token) {
      userStore.getUser().finally(()=>commonStore.setAppLoaded()) 
    }else{
      commonStore.setAppLoaded();
    }
  },[commonStore,userStore]);

  if (!commonStore.appLoaded) {
    return <LoadingComponent content='Loading App'/>
  }//end if
  else{
    return (
      <>
      <ToastContainer position='bottom-right' hideProgressBar/>
      <ModalContainer/>
      {location.pathname === '/' ? <HomePage/> 
      : (
        <>
          <ScrollToTop/>
          <NavigBar/>
          <Container style={{marginTop:'7em'}}>
              <Outlet/>
          </Container>
        </>

      )}
      
      {/* <Routes>
        <Route path='/' element={<HomePage/>} /> 
        <Route  element={<Layout/>}>
          <Route path='/activities'  element={<ActivityDashboard/>}/>
          <Route path='/activities/:id' element={<ActivityDetails/>}/>
          {["/createActivity", "/manage/:id"].map((path) => {
            return (
              <Route key={location.key} path={path} element={<ActivityForm key={location.key} />} />
            );
          })}
          <Route path='/profiles/:username' element={<ProfilePage/>}/> 
          <Route path='/errors' element={<TestErrors/>}/> 
          <Route path='*' element={<NotFound />} />
          <Route path='/Server-Error' element={<ServerError />} />
          <Route path='/login' element={<LoginForm />} />
        </Route> 
      </Routes> */}
      </>
    );
  }//end else
}//end function App

//this is for Mobx
export default observer(App);
