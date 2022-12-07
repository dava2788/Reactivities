import React, { useEffect, useState } from 'react';
import { Button, Grid, Header} from 'semantic-ui-react';
import PhotoWidgetCropper from './PhotoWidgetCropper';
import PhotoWidgetDropZone from './PhotoWidgetDropZone';

interface Props{
    loading:boolean;
    uploadPhoto:(file:Blob)=> void;
}

function PhotoUploadWidget({loading,uploadPhoto}:Props) {
    const [files,setFiles]=useState<any>([]);
    const [cropper,setCrooper]=useState<Cropper>();

    function onCrop(){
        if (cropper) {
            cropper.getCroppedCanvas().toBlob(blob=>uploadPhoto(blob!));
        }//end if (cropper)
        
    }//end onCrop

    //this useEffect is for clean the memory for our dropzone photo widget
    //Usig the files.forEach((file:any) =>URL.revokeObjectURL(file.preview));
    useEffect(()=>{
        return()=>{
            files.forEach((file:any) =>URL.revokeObjectURL(file.preview));
        }
    },[files]);

    return (
        <Grid>
            <Grid.Column width={4}>
                <Header sub color='teal' content='Step 1 - Add Photo'/>
                <PhotoWidgetDropZone setFiles={setFiles}/>
            </Grid.Column>
            <Grid.Column width={1}/>
            <Grid.Column width={4}>
                <Header sub color='teal' content='Step 2 - Resize Image'/>
                {files && files.length > 0 && (
                    <PhotoWidgetCropper setCropper={setCrooper} imagePreview={files[0].preview}/>
                )}
            </Grid.Column>
            <Grid.Column width={1}/>
            <Grid.Column width={4}>
                <Header  sub color='teal' content='Step 3 -Preview & Upload'/>
                {files && files.length>0 &&
                <>
                    <div className='image-preview' style={{minHeight:200,overflow:'hidden'}}/>
                    <Button.Group widths={2}>
                        <Button onClick={onCrop} positive icon='check' loading={loading}/>
                        <Button onClick={()=>setFiles([])} icon='close' disabled={loading}/>

                    </Button.Group>
                </>
                }
                
            </Grid.Column>
        </Grid>
    );//end return
}//end PhotoUploadWidget

export default PhotoUploadWidget;