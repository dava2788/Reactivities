import { observer } from "mobx-react-lite";
import React  from "react";
import { NavLink } from "react-router-dom";
import { Button, Container, Menu } from "semantic-ui-react";



export default observer(function NavigBar(){
    return(
        <Menu inverted fixed="top">
            <Container>
                {/* end parametes is the replace of Exact for not have two link active at the same time */}
                <Menu.Item as={NavLink} to='/' end header>
                    <img src="/assets/logo.png" alt="logo" style={{marginRight:'10px'}}/>
                    Reactivities
                </Menu.Item>
                <Menu.Item as={NavLink} to='/activities' name="Activities" exact="true" />
                <Menu.Item>
                    <Button positive content='Create Activity' as={NavLink} to='/createActivity' exact="true" ></Button>
                </Menu.Item>
            </Container>
        </Menu>
    )//end return

}//end function NavigBar
)