import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Photo, Profile } from "../models/profile";
import { store } from "./store";

export default class ProfileStore{
    profile:Profile | null=null;
    loadingProfile=false;
    uploading=false;
    Loading=false;

    constructor(){
        makeAutoObservable(this);

    }//end constructor

    get IsCurrentUser(){
        if (store.userStore.user && this.profile) {
            return store.userStore.user.username===this.profile.username;
        }//end if (store.userStore.user && this.profile)
        return false;
    }//end IsCurrentUser

    loadProfile=async (username:string)=>{
        this.loadingProfile=true;
        try {
            const profile=await agent.Profiles.get(username);
            runInAction(()=>{
                this.profile=profile;
                this.loadingProfile=false;
            });
            
        } catch (error) {
            console.log(error);
            runInAction(()=>this.loadingProfile=false);
        }//end catch
    }//end loadProfile

    uploadPhoto=async(file:Blob)=>{
        this.uploading=true;
        try {
          const response =  await agent.Profiles.uploadPhoto(file);
          const photo= response.data;
          runInAction(()=>{
            if (this.profile) {
                this.profile?.photos?.push(photo);
                if (photo.isMain && store.userStore.user) {
                    store.userStore.setImage(photo.url);
                    this.profile.image=photo.url;
                }//end if (photo.isMain && store.userStore.user) 
            }//end if (this.profile)
            this.uploading=false;

          });
            
        } catch (error) {
            console.log(error);
            runInAction(()=>this.uploading=false);
        }//end catch

    }//end uploadPhoto
    setMainPhoto = async (photo:Photo)=>{
        this.Loading=true;
        try {
            await agent.Profiles.SetMainPhoto(photo.id);
            store.userStore.setImage(photo.url);
            runInAction(()=>{
                if (this.profile && this.profile.photos) {
                    this.profile.photos.find(p=>p.isMain)!.isMain=false;
                    this.profile.photos.find(p=>p.id===photo.id)!.isMain=true;
                    this.profile.image=photo.url;
                    this.Loading=false
                }//end if (this.profile)
            });//end runInAction
        } catch (error) {
            runInAction(()=>this.Loading=false);
            console.log(error)
        }//end catch
    }//end setMainPhoto
    deletePhoto=async (photo:Photo)=>{
        this.Loading =true;
        try {
            await agent.Profiles.deletePhoto(photo.id);
            runInAction(()=>{
                if (this.profile) {
                    this.profile.photos=this.profile.photos?.filter(p=>p.id!==photo.id);
                    this.Loading=false
                }//end if (this.profile)
            });//end runInAction

        } catch (error) {
            runInAction(()=>this.Loading=false);
            console.log(error)
        }//end catch
    }//end deletePhoto

    updateProfile = async (profile: Partial<Profile>) => {
        this.Loading = true;
        try {
            await agent.Profiles.updateProfile(profile);
            runInAction(() => {
                if (profile.displayName && profile.displayName !==
                store.userStore.user?.displayName) {
                store.userStore.SetDisplayName(profile.displayName);
                }
                this.profile = {...this.profile, ...profile as Profile};
                this.Loading = false;
            });
        } catch (error) {
            console.log(error);
            runInAction(() => this.Loading = false);
        }//end catch
    }//end updateProfile
}//end class ProfileStore