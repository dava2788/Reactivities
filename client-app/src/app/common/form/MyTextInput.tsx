import { useField } from 'formik';
import React from 'react';
import { Form, Label } from 'semantic-ui-react';

interface Props{
    placeholder:string;
    name:string;
    label?:string;
    type?:string;

}

export default function MyTextInput(props:Props) {
    const [field,meta]=useField(props.name);

    return (
        // The !! in the !!meta.error is for convert this into a Boolean
        // if the error is null or define will be false
        <Form.Field error={meta.touched && !!meta.error}>
            <label>{props.label}</label>
            {/* this {...field} {...props} is for spread the field and props Properties to the input element */}
            <input {...field}{...props}/>
            {meta.touched && meta.error 
            ? (<Label basic color='red'>{meta.error}</Label>)
            : null}

        </Form.Field>
    );//end return
}//end MyTextInput

 