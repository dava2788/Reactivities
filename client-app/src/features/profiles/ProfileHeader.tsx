import { observer } from 'mobx-react-lite';
import React from 'react';
import { Button, Divider, Grid, Header, Item, Reveal, Segment, Statistic } from 'semantic-ui-react';
import { Profile } from '../../app/models/profile';

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
                        <Statistic label='Followers' value='5'/>
                        <Statistic label='Following' value='42'/>
                    </Statistic.Group>
                    <Divider/>
                    <Reveal animated='move'>
                        <Reveal.Content visible style={{width:'100%'}}>
                            <Button fluid color='teal' content='Following'/>
                        </Reveal.Content>
                        <Reveal.Content hidden style={{width:'100%'}}>
                            <Button basic fluid color={true?'red' : 'green'} content={true ?'UnFollow':'Follow' }/>
                        </Reveal.Content>
                        
                    </Reveal>

                </Grid.Column>
            </Grid>
        </Segment>
    );
}//end function ProfileHeader

)
