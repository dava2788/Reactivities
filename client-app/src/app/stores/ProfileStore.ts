import { makeAutoObservable, reaction, runInAction } from "mobx";
import agent from "../api/agent";
import { Photo, Profile } from "../models/profile";
import { store } from "./store";

export default class ProfileStore{
    profile:Profile | null=null;
    loadingProfile=false;
    uploading=false;
    Loading=false;
    followings: Profile[] =[];
    loadingFollowings=false;
    activeTab=0;

    constructor(){
        makeAutoObservable(this);
        reaction(
            ()=>this.activeTab,
            activeTab=>{
                if (activeTab===3 || activeTab===4) {
                    const predicate = activeTab===3 ? "followers" : "following";
                    this.loadFollowing(predicate);
                }//end if (activeTab===3 || activeTab===4) 
                else{
                    this.followings=[];
                }// End ELSE if (activeTab===3 || activeTab===4)
            }//end activeTab
        );//End Reaction
    }//end constructor

    setActiveTab =(activeTab:any)=>{
        this.activeTab= activeTab;

    }//end setActiveTab

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

    updateFollowing = async(username:string,following:boolean) =>{
        this.Loading=true;
        try {
            
            await agent.Profiles.updateFollowing(username);
            store.activityStore.updateAttendeeFollowing(username);

            runInAction(()=>{
                if (this.profile && this.profile.username !== store.userStore.user?.username && this.profile.username === username) {
                    following ? this.profile.followersCount++ : this.profile.followersCount--;
                    this.profile.following = !this.profile.following;
                }//end if (this.profile && this.profile.username !== store.userStore.user?.username)

                if (this.profile && this.profile.username === store.userStore.user?.username) {
                    following ? this.profile.followingCount++ : this.profile.followingCount--;
                }//end if (this.profile && this.profile.username === store.userStore.user?.username)

                this.followings.forEach(profile=>{
                    if (profile.username===username) {
                        profile.following ? profile.followersCount-- : profile.followersCount++;
                        profile.following = !profile.following;
                    }//end if (profile.username==username)
                })//end this.followings.forEach

                this.Loading=false;
            });

        } catch (error) {
            console.log(error);
            runInAction(()=>this.Loading=false);
        }//end catch

    }//end updateFollowing

    loadFollowing = async(predicate:string)=>{
        this.loadingFollowings=true;
        try {
            const followings : Profile[]= await agent.Profiles.listFollowings(this.profile!.username,predicate);
            runInAction(()=>{
                this.followings=followings;
                this.loadingFollowings=false;
            });
        } catch (error) {
            console.log(error);
            runInAction(()=>this.loadingFollowings=false);
        }//end catch
    }//end loadFollowing

}//end class ProfileStore