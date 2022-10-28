import { makeAutoObservable, reaction } from "mobx";
import { ServerError } from "../models/ServerError";

export default class CommonStore {
    error:ServerError | null=null;
    token:string |null =  window.localStorage.getItem('jwt');
    appLoaded:boolean =false;

    constructor(){
        makeAutoObservable(this);
        //only run when the token changes
        reaction(
            ()=> this.token,
            token=>{
                if (token) {
                    window.localStorage.setItem('jwt',token);
                }else{
                    window.localStorage.removeItem('jwt');
                }//end else
            }
        );//end rection
    }//end constructor

    setServerError=(error:ServerError)=>{
        this.error=error;
    }//end setServerError

    setToken=(token:string | null)=>{
        this.token=token;
    }//end setToken

    setAppLoaded= () => {
        this.appLoaded=true;
    }//end setAppLoaded
}//end class CommonStore 