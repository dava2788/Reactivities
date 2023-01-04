import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { User, UserFormValues } from "../models/user";
import { router } from "../routes/Routes";
import { store } from "./store";

export default class UserStore{
    user:User | null = null;
    fbLoading=false;
    refreshTokenTimeout:any;

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
            this.startRefreshTokenTimer(user);
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
            store.commonStore.setToken(user.token);
            runInAction(()=> this.user=user);
            this.startRefreshTokenTimer(user);
        } catch (error) {
            console.log(error);
        }//end catch
    }//end getUser

    register =async(creds : UserFormValues)=>{
        try {
            await agent.Account.register(creds);            
            router.navigate(`/account/registerSuccess?email=${creds.email}`);
            store.modalStore.closeModal();
        }//end try
        catch (error:any) {
            if(error?.respose.status=== 400) throw error;
            store.modalStore.closeModal();
            console.log(500);
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
            this.startRefreshTokenTimer(user);
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

    refreshToken= async ()=>{
        this.stopRefreshTokenTimer();
        try {
            const user= await agent.Account.refrehsToken();
            runInAction(()=>this.user=user);
            store.commonStore.setToken(user.token);
            this.startRefreshTokenTimer(user);
        } catch (error) {
            console.log(error);
        }//end catch

    }//end refreshToken

    private startRefreshTokenTimer(user:User)
    {
        //THis is for decode the token the atob function
        const jwToken = JSON.parse(atob(user.token.split('.')[1]));
        const expires = new Date(jwToken.exp *1000);
        //set the timeout to 60 seconds before expired
        const timeout= expires.getTime()-Date.now()- (60 *1000);
        //with this property the idea is refresh the token every 30 prior the expires of the token
        //In the background the user is going to be unaware of this unless they take a look in the network tab 
        this.refreshTokenTimeout=setTimeout(this.refreshToken,timeout);
    }//end startRefreshTokenTimer

    private stopRefreshTokenTimer()
    {
        clearTimeout(this.refreshTokenTimeout);

    }//end stopRefreshTokenTimer

}//end class UserStore