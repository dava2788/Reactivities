import { observer } from 'mobx-react-lite';
import React, { SyntheticEvent } from 'react';
import { Button, Reveal } from 'semantic-ui-react';
import { Profile } from '../../app/models/profile';
import { useStore } from '../../app/stores/store';

interface Props {
    profile:Profile
}

function FollowButton({profile}:Props) {
    const {profileStore,userStore} =useStore();
    const {updateFollowing,Loading} =profileStore;

    if (userStore.user?.username===profile.username) {
        return null;
    }//end if

    function handleFollow(event:SyntheticEvent,username:string){
        event.preventDefault();
        profile.following? updateFollowing(username,false) : updateFollowing(username,true);
    }//end handleFollow


    return (
        <Reveal animated='move'>
            <Reveal.Content visible style={{width:'100%'}}>
                <Button fluid color='teal' content={profile.following ? 'Following' :'Not Following'}/>
            </Reveal.Content>
            <Reveal.Content hidden style={{width:'100%'}}>
                <Button basic fluid 
                    color={profile.following ?'red' : 'green'} content={profile.following  ?'UnFollow':'Follow' }
                    loading={Loading} onClick={(e)=>handleFollow(e,profile.username)}
                />
            </Reveal.Content>
        </Reveal>
    );//end return
}//end FollowButton

export default observer(FollowButton);

