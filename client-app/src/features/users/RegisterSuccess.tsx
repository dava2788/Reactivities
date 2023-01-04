import React from 'react';
import { toast } from 'react-toastify';
import { Button, Header, Icon, Segment } from 'semantic-ui-react';
import agent from '../../app/api/agent';
import useQuery from '../../app/util/hooks';

function RegisterSuccess() {
    const email = useQuery().get('email') as string;

    function handleConfirmEmailResend(){
        agent.Account.resendEmailConfirm(email).then(()=>{
            toast.success('Verfication email resend -Please check your email');
        }).catch(error=>console.log(error));
    }//end handleConfirmEmailResend
    return (
        <Segment placeholder textAlign='center'>
            <Header icon color='green'>
                <Icon name='check' />
                Successfully registered!
            </Header>
            <p>Please check your email (including junk email) for the verification email</p>
            {email &&
            <>
                <p>Didn't receive the email? Click the below button ro Resendt</p>
                <Button primary onClick={handleConfirmEmailResend} content="Resend Email" size='huge' />
            </>
            }
        </Segment>
    );
}

export default RegisterSuccess;