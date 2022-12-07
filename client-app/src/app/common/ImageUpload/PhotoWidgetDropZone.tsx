import React, {useCallback} from 'react'
import { useDropzone } from 'react-dropzone';
import { Header, Icon } from 'semantic-ui-react';


interface Props{
    setFiles: (files:any)=> void;
}//end Props

export default function PhotoWidgetDropZone({setFiles}:Props) {
    const dzStyles = {
        border:'dash 3px #eee',
        borderColor:'#eee',
        borderRadius:'5px',
        paddingTop:'30px',
        textAlign:'center' as 'center',
        height:200
    }

    const dzActive = {
        borderColor:'green',

    }

   //Memory version of a callback thath only change 
   //when one of the dependency changed
  const onDrop = useCallback((acceptedFiles: any) => {
    setFiles(acceptedFiles.map((file:any)=>Object.assign(file,{
        preview:URL.createObjectURL(file)
    })) );

  }, [setFiles]);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    //with this code {...dzStyles,...dzActive} we are using (spreding)
    //all the properties from dzStyles and then using the dzActive Override the repeat one
    //Short word a combination between those two
    <div {...getRootProps()} style={isDragActive ? {...dzStyles,...dzActive}:dzStyles}>
      <input {...getInputProps()} />
      <Icon name='upload' size='huge'/>
      <Header content='Drop image here' />

    </div>
  )//end return 
}//end PhotoWidgetDropZone function