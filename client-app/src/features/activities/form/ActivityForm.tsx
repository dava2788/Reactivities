import { observer } from 'mobx-react-lite';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button,  Header,  Segment } from "semantic-ui-react";
import LoadingComponent from '../../../app/layout/LoadingComponents';
import { useStore } from '../../../app/stores/store';
import { Link } from 'react-router-dom';
import { Formik,Form } from 'formik';
import * as Yup from 'yup';
import MyTextInput from '../../../app/common/form/MyTextInput';
import MyTextArea from '../../../app/common/form/MyTextArea';
import MySelectInput from '../../../app/common/form/MySelectInput';
import { categoryOptions } from '../../../app/common/options/categoryOptions';
import MyDateInput from '../../../app/common/form/MyDateInput';
import { Activity } from '../../../app/models/activity';
import { v4 as uuid } from 'uuid';

export default observer(function ActivityForm(){
    const navigate=useNavigate();
    const {activityStore}= useStore();
    const{createActivity,updateActivity,loading,loadActitivy,loadingInitial}=activityStore;
    const{id} =useParams<{id: string}>();

    const [activity, SetActivity]=useState<Activity>({
        id: '',
        title: '',
        date: null,
        description: '',
        category: '',
        city: '',
        venue: '',
    });
   
    useEffect(()=>{
        if (id) {
            loadActitivy(id).then(activity=>SetActivity(activity!));
        }//end  if (id)
    },[id,loadActitivy]);//end useEffect

    const validationSchema=Yup.object({
        title:Yup.string().required('The Activity Title is Required'),
        description:Yup.string().required('The Activity description is Required'),
        category:Yup.string().required(),
        date:Yup.string().required("Date is required").nullable(),
        venue:Yup.string().required(),
        city:Yup.string().required(),
    });

    function handleFromSubmit(activity:Activity){
        if(activity.id.length===0){
            let newActivity={
                ...activity,
                id:uuid()
            };//end newActivity
            createActivity(newActivity).then(()=>{
                navigate(`/activities/${newActivity.id}`)
            });//end createActivity.then
        }//end if(activity.id.length===0)
        else{
            updateActivity(activity).then(() => navigate(`/activities/${activity.id}`))
        }//end ELSE if(activity.id.length===0)

    }//end handleSubmit

    if (loadingInitial) {
        return <LoadingComponent content='Loading Activity'></LoadingComponent>
    }//end if else
    else{
        return(
            <Segment clearing>
                <Header content='Activity Detial' sub color='teal'></Header>
                <Formik enableReinitialize initialValues={activity} onSubmit={values=>handleFromSubmit(values)} validationSchema={validationSchema}>
                    {({handleSubmit,isValid,isSubmitting,dirty})=>(
                        <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                            {/* You have to match the name of the Field to exactly the same
                            case sensitive to the name of the object parameter.
                            For example title and activity.title */}
                            <MyTextInput name='title' placeholder='Title'></MyTextInput>
                            <MyTextArea rows={3} placeholder='Description' name='description'/>
                            <MySelectInput option={categoryOptions} placeholder='Category' name='category' />
                            <MyDateInput  placeholderText='Date' name='date' showTimeSelect timeCaption='time' dateFormat='MMMM d, yyyy h:mm aa' />

                            <Header content='Location Detial' sub color='teal'></Header>
                            <MyTextInput placeholder='City' name='city' />
                            <MyTextInput placeholder='Venue' name='venue' />
                            <Button disabled={isSubmitting || !dirty || !isValid} floated="right" positive type="submit" content="Submit" loading={loading}/>
                            <Button floated="right" type="button" content="Cancel" as={Link} to={`/activities`}/>
                        </Form>
                    )}
                </Formik>
            </Segment>
        );//end return
    }//end ELSE if (loadingInitial)
}//end ActivityForm
)//end observer