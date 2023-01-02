import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useStore } from '../stores/store';

function RequiredAuth() {
    const {userStore:{isLoggedin}} = useStore();
    const location = useLocation();

    if (!isLoggedin){
        return <Navigate to='' state={{from:location}} />
    }//end if (!isLoggedin)
    
    return <Outlet/>

    
}//end RequiredAuth

export default RequiredAuth;