import { ErrorMessage, Form, Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Button, Header, Label } from 'semantic-ui-react';
import MyTextInput from '../../app/common/form/MyTextInput';
import { useStore } from '../../app/stores/store';


//when you are using the useStore 
//you need to make the function observabl.e
export default observer( function LoginForm() {
    const {userStore} = useStore();

    return (
        <Formik 
            initialValues={{email:'',password:'',error:null}} 
            onSubmit={
                (values,{setErrors})=>(
                    userStore.login(values)
                    .catch(error=>setErrors(
                        {error:error.response.data}
                    ))
                )
            }
        >
            {({handleSubmit,isSubmitting,errors})=>(
                <Form className='ui form' onSubmit={handleSubmit} autoComplete='on'>
                    <Header as='h2' content='LogIn To Reactivities' color='teal' textAlign='center'></Header>
                    <MyTextInput name='email' placeholder='email'/>
                    <MyTextInput name='password' placeholder='password' type='password'/>
                    <ErrorMessage 
                        name='error'
                        render={()=> <Label style={{marginBotton:10}} basic color='red' content={errors.error}/>}
                    />
                    <Button loading={isSubmitting} positive content='login' type='submit' fluid/>
                </Form>
            )}

        </Formik>
    );
}//end LoginForm
)