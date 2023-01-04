import { observer } from "mobx-react-lite";
import React  from "react";
import { Link, NavLink } from "react-router-dom";
import { Button, Container, Dropdown, Image, Menu, MenuItem } from "semantic-ui-react";
import { useStore } from "../stores/store";



export default observer(function NavigBar(){
    const {userStore:{user,logout,isLoggedin}}=useStore();
    return(
        <Menu inverted fixed="top">
            <Container>
                {/* end parametes is the replace of Exact for not have two link active at the same time */}
                <Menu.Item as={NavLink} to='/' end header>
                    <img src="/assets/logo.png" alt="logo" style={{marginRight:'10px'}}/>
                    Reactivities
                </Menu.Item>
                {isLoggedin && 
                <>
                    <Menu.Item as={NavLink} to='/activities' name="Activities" exact="true" />
                    <Menu.Item as={NavLink} to='/errors' name="Errors" exact="true" />
                    <Menu.Item>
                        <Button positive content='Create Activity' as={NavLink} to='/createActivity' exact="true" ></Button>
                    </Menu.Item>
                    <MenuItem position="right">
                        <Image src={user?.image || '/assets/user.png'} avatar spaced="right"></Image>
                        <Dropdown pointing='top left' text={user?.displayName}>
                            <Dropdown.Menu >
                                <Dropdown.Item as={Link} to={`/profiles/${user?.username}`} text="My Profile" icon='user'/>
                                <Dropdown.Item onClick={logout} text='Logout' icon='power'/>
                            </Dropdown.Menu>
                        </Dropdown>
                    </MenuItem>
                </>
                }
                
            </Container>
        </Menu>
    )//end return

}//end function NavigBar
)