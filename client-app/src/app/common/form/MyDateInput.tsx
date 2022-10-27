import { useField } from 'formik';
import { Form, Label } from 'semantic-ui-react';
import DatePicker,{ReactDatePickerProps} from 'react-datepicker';

// Using the Partial<ReactDatePickerProps> is for set all the ReactDatePickerProps
// for be  optinal
export default function MyDateInput(props:Partial<ReactDatePickerProps>) {
    const [field,meta,helpers]=useField(props.name!);

    return (
        // The !! in the !!meta.error is for convert this into a Boolean
        // if the error is null or define will be false
        <Form.Field error={meta.touched && !!meta.error}>
            <DatePicker {...field} {...props} 
                selected={(field.value && new Date(field.value)) || null}
                onChange={value=>helpers.setValue(value)}
            />
            
            {meta.touched && meta.error 
            ? (<Label basic color='red'>{meta.error}</Label>)
            : null}

        </Form.Field>
    );//end return
}//end MyTextInput

 