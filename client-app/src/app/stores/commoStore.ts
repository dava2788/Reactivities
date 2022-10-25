import { makeAutoObservable } from "mobx";
import { ServerError } from "../models/ServerError";

export default class CommonStore {
    error:ServerError | null=null;
    constructor(){
        makeAutoObservable(this);
    }//end constructor

    setServerError=(error:ServerError)=>{
        this.error=error;
    }//end setServerError
}//end class CommonStore 