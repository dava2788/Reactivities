import { useField } from 'formik';
import { Form, Label, Select } from 'semantic-ui-react';

interface Props{
    placeholder:string;
    name:string;
    option:any;
    label?:string;

}

export default function MySelectInput(props:Props) {
    const [field,meta,helpers]=useField(props.name);

    return (
        // The !! in the !!meta.error is for convert this into a Boolean
        // if the error is null or define will be false
        <Form.Field error={meta.touched && !!meta.error}>
            <label>{props.label}</label>
            {/* this {...field} {...props} is for spread the field and props Properties to the input element */}
            <Select clearable options={props.option} value={field.value|| null} 
                onChange={(event,data)=>helpers.setValue(data.value)}
                onBlur={()=>helpers.setTouched(true)} placeholder={props.placeholder}>
            </Select>
            {meta.touched && meta.error 
            ? (<Label basic color='red'>{meta.error}</Label>)
            : null}

        </Form.Field>
    );//end return
}//end MyTextInput

 