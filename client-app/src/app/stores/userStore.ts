import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { User, UserFormValues } from "../models/user";
import { router } from "../routes/Routes";
import { store } from "./store";

export default class UserStore{
    user:User | null = null;
    fbLoading=false;

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
            router.navigate('/activities');
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
        router.navigate('/');
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
            router.navigate('/activities');
            store.modalStore.closeModal();
        }//end try
        catch (error) {
            throw error;
        }//end catch
    }//end register


    setImage=(image:string)=>{
        if (this.user) {
            this.user.image=image;
        }//end if (this.user)
    }//end setImage

    SetDisplayName=(name:string)=>{
        if (this.user) this.user.displayName = name;

    }//end SetDisplayName

    facebookLogin=async(accessToken:string)=>{
        try {
            this.fbLoading=true;
            const user = await agent.Account.fbLogin(accessToken);
            store.commonStore.setToken(user.token);
            runInAction(()=>{
                this.user= user;
                this.fbLoading=false;
            });
            router.navigate('/activities')
        } catch (error) {
            console.log(error);
            runInAction(()=>{
                this.fbLoading=false;
            });
        }

    }//end facebookLogin

}//end class UserStore