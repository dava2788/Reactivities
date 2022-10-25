import { createContext,useContext } from "react";
import ActivityStore from "./activityStore";
import CommonStore from "./commoStore";

interface Store{
    activityStore: ActivityStore;
    commonStore:CommonStore
}//end interface Store

export const store:Store={
    activityStore:new ActivityStore(),
    commonStore:new CommonStore()
}//end const store:Store

export const StoreContext =createContext(store);

export function useStore(){
    return useContext(StoreContext);
}//end function useStore