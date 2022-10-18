import { createContext,useContext } from "react";
import ActivityStore from "./activityStore";

interface Store{
    activityStore: ActivityStore
}//end interface Store

export const store:Store={
    activityStore:new ActivityStore()
}//end const store:Store

export const StoreContext =createContext(store);

export function useStore(){
    return useContext(StoreContext);
}//end function useStore