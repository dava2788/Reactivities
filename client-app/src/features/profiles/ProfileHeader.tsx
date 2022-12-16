import { observer } from 'mobx-react-lite';
import React from 'react';
import {  Divider, Grid, Header, Item,  Segment, Statistic } from 'semantic-ui-react';
import { Profile } from '../../app/models/profile';
import FollowButton from './FollowButton';

interface Props{
    profile:Profile;
}//end interface

//Even thougt we are not using an store directly we need to add the 
//observer classs because
// this profile props is comming from a store, and even thought we are not 
//using the store directly we need to make it observer
//If not it will not react to any changes  
export default observer(function ProfileHeader({profile}:Props) {
    return (
        <Segment>
            <Grid>
                <Grid.Column width={12}>
                    <Item.Group>
                        <Item>
                            <Item.Image avatar size='small' src={profile.image || '/assets/user.png'}/>
                            <Item.Content verticalAlign='middle'>
                                <Header as='h1' content={profile.username}/>
                            </Item.Content>
                        </Item>
                    </Item.Group>

                </Grid.Column>
                <Grid.Column width={4}>
                    <Statistic.Group widths={2}>
                        <Statistic label='Followers' value={profile.followersCount}/>
                        <Statistic label='Following' value={profile.followingCount}/>
                    </Statistic.Group>
                    <Divider/>
                    <FollowButton profile={profile}/>
                </Grid.Column>
            </Grid>
        </Segment>
    );
}//end function ProfileHeader

)
