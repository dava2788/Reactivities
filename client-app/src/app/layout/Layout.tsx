import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import NavigBar from './NavigBar';

export default function Layout() {
    return (
        <>
            <NavigBar/>
            <Container style={{marginTop:'7em'}}>
                <Outlet/>
            </Container>
        </>
    );
}//end Layout

