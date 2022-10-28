import { makeAutoObservable } from "mobx"

interface Modal{
    open: boolean,
    body: JSX.Element | null

}//end Interface Modal

export default class ModalStore {
    modal:Modal={
        open:false,
        body:null
    }

    constructor(){
        makeAutoObservable(this);
    }

    openModal=(content:JSX.Element) =>{
        this.modal.open=true;
        this.modal.body=content;

    }//end openModal

    closeModal=() =>{
        this.modal.open=false;
        this.modal.body=null;

    }//end closeModal
    

}//end class ModalStore {