import { createContext,useContext } from "react";
import ActivityStore from "./activityStore";
import CommentStore from "./commentStore";
import CommonStore from "./commoStore";
import ModalStore from "./ModalStore";
import ProfileStore from "./ProfileStore";
import UserStore from "./userStore";

interface Store{
    activityStore: ActivityStore;
    commonStore:CommonStore;
    userStore:UserStore;
    modalStore : ModalStore;
    profileStore:ProfileStore;
    commentStore:CommentStore;

}//end interface Store

export const store:Store={
    activityStore:new ActivityStore(),
    commonStore:new CommonStore(),
    userStore:new UserStore(),
    modalStore : new ModalStore(),
    profileStore: new ProfileStore(),
    commentStore: new CommentStore()


}//end const store:Store

export const StoreContext =createContext(store);

export function useStore(){
    return useContext(StoreContext);
}//end function useStore