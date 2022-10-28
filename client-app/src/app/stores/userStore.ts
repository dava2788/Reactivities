import { makeAutoObservable, runInAction } from "mobx";
import { AppHistory } from "../..";
import agent from "../api/agent";
import { User, UserFormValues } from "../models/user";
import { store } from "./store";

export default class UserStore{
    user:User | null = null;
    
    constructor(){
        makeAutoObservable(this)
    }//end constructor

    get isLoggedin(){
        return !!this.user;
    }

    login=async(creds : UserFormValues)=>{
        try {
            const user = await agent.Account.login(creds);
            store.commonStore.setToken(user.token);
            runInAction(()=>this.user=user);
            AppHistory.push('/activities');
            store.modalStore.closeModal();
        }//end try
        catch (error) {
            throw error;
        }//end catch
    }//end login

    logout=()=>{
        store.commonStore.setToken(null);
        window.localStorage.removeItem('jwt');
        this.user=null;
        AppHistory.push('/');
    }//end logout

    getUser=async ()=>{
        try {
            const user= await agent.Account.current();
            runInAction(()=> this.user=user);
        } catch (error) {
            console.log(error);
        }//end catch
    }//end getUser

    register =async(creds : UserFormValues)=>{
        try {
            const user = await agent.Account.register(creds);
            store.commonStore.setToken(user.token);
            runInAction(()=>this.user=user);
            AppHistory.push('/activities');
            store.modalStore.closeModal();
        }//end try
        catch (error) {
            throw error;
        }//end catch
    }//end register


}//end class UserStore