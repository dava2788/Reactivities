import { ErrorMessage, Form, Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Button, Header } from 'semantic-ui-react';
import MyTextInput from '../../app/common/form/MyTextInput';
import { useStore } from '../../app/stores/store';
import * as Yup from 'yup';
import ValidationErrors from '../errors/ValidationErrors';

//when you are using the useStore 
//you need to make the function observabl.e
export default observer( function RegisterForm() {
    const {userStore} = useStore();

    return (
        <Formik 
            initialValues={{displayName:'',username:'',email:'',password:'',error:null}} 
            onSubmit={
                (values,{setErrors})=>(
                    userStore.register(values)
                    .catch(error=>setErrors(
                        {error:error}
                    ))
                )
            }
            validationSchema={Yup.object({
                displayName:Yup.string().required(),
                username:Yup.string().required(),
                email:Yup.string().required().email(),
                password:Yup.string().required(),
            })}
        >
            {/* these are the render Props we are passing to our form */}
            {({handleSubmit,isSubmitting,errors,isValid,dirty})=>(
                <Form className='ui form error' onSubmit={handleSubmit} autoComplete='off'>
                    <Header as='h2' content='Sign up To Reactivities' color='teal' textAlign='center'></Header>
                    <MyTextInput name='displayName' placeholder='Display Name'/>
                    <MyTextInput name='username' placeholder='UserName'/>
                    <MyTextInput name='email' placeholder='email'/>
                    <MyTextInput name='password' placeholder='password' type='password'/>
                    <ErrorMessage 
                        name='error'
                        render={()=> <ValidationErrors errors={errors.error}/>}
                    />
                    <Button disabled={!isValid ||!dirty || isSubmitting} loading={isSubmitting} positive content='Register' type='submit' fluid/>

                </Form>
            )}

        </Formik>
    );
}//end RegisterForm
)