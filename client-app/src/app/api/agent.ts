import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { Activity, ActivityFormValues } from "../models/activity";
import { PaginatedResult } from "../models/pagination";
import { Photo, Profile, UserActivity } from "../models/profile";
import { User, UserFormValues } from "../models/user";
import { router } from "../routes/Routes";
import { store } from "../stores/store";

const sleep =(delay:number)=>{
    return new Promise((resolve)=>{
        setTimeout(resolve,delay);
    });
}

axios.defaults.baseURL=process.env.REACT_APP_API_URL;

axios.interceptors.request.use(config=>{
    const token = store.commonStore.token;
    if(token && config.headers){config.headers.Authorization=`Bearer ${token}`}
    return config;
})

axios.interceptors.response.use(async response=>{
    if (process.env.NODE_ENV==='development') await sleep(1000);
    
    const pagination = response.headers['pagination'];
    if (pagination) {
        response.data = new PaginatedResult(response.data, JSON.parse(pagination));
        return response as AxiosResponse<PaginatedResult<any>>
    }

    return response;

},(error:AxiosError)=>{
    const {data, status, config,headers}:{data:any,status:number,config:AxiosRequestConfig<any>,headers:any} = error.response as AxiosResponse;
    switch (status) {
        case 400:
            if (typeof data=='string') {
                toast.error(data);
            }//END if (typeof data=='string')

            if (config.method==='get' && data.errors.hasOwnProperty('id')) {
                router.navigate("/NotFound");
            }//end if (config.method=='get' && data.errors.hasOwnProperty('id')) 

            if (data.errors) {
                const modalStateErrors=[];
                for (const key in data.errors) {
                    if (data.errors[key]) {
                        modalStateErrors.push(data.errors[key])
                    }//end  if (data.errors[key])
                }//end for
                throw modalStateErrors.flat();
            }//end if (data.errors) 
            break;
        case 401:
            if(status===401 && headers['www-authenticate']?.startsWith('Bearer error="invalid_token"'))
            {
                store.userStore.logout();
                toast.error("Session Expired - Please Log In Again");
            }//end if
            
            break;
        case 404:
            toast.error("Not Found");
            router.navigate("/NotFound");
            break;
        case 500:
            store.commonStore.setServerError(data);
            router.navigate("/Server-Error");
            break;
        default:
            console.log(data);
            break;
    }//end switch
    return Promise.reject(error);

})
const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
}

const Activities={
    list:(params:URLSearchParams)=>axios.get<PaginatedResult<Activity[]>>('/activities',{params:params}).then(responseBody),
    details:(id:string)=>requests.get<Activity>(`/activities/${id}`),
    create:(activity:ActivityFormValues)=>requests.post<void>('/activities',activity),
    update:(activity:ActivityFormValues)=>requests.put<void>(`/activities/${activity.id}`,activity),
    delete:(id:string)=>requests.del<void>(`/activities/${id}`),
    attend:(id:string)=>requests.post<void>(`/activities/${id}/attend`,{})
}

const Account={
    current:()=>requests.get<User>('/account'),
    login:(user:UserFormValues)=>requests.post<User>('/account/login',user),
    register:(user:UserFormValues)=>requests.post<User>('/account/register',user),
    fbLogin:(accessToken:string)=>requests.post<User>(`/account/fbLogin?accessToken=${accessToken}`,{}),
    refrehsToken:()=>requests.post<User>("/account/RefreshToken",{})
}

const Profiles={
    get:(username:string)=>requests.get<Profile>(`/profiles/${username}`),
    //this method is more complex we will need to upload the image
    //we will use axio directly
    uploadPhoto:(file:Blob)=>{
        let formData= new FormData();
        //This need to match the name of the property
        formData.append('File',file);
        return axios.post<Photo>('photos', formData, {
            //we need to be very carefull with the spelling
            //Take a look very carefull to the upper case
            headers: {'Content-Type': 'multipart/form-data'}
        });
    },//upload Photo

    SetMainPhoto:(id:string)=>requests.post(`/photos/${id}/setMain`,{}),
    deletePhoto:(id:string)=>requests.del(`/photos/${id}`),
    updateProfile:(profile:Partial<Profile>)=> requests.put(`/profiles`,profile),
    updateFollowing:(username:string)=>requests.post(`/follow/${username}`,{}),
    listFollowings:(username:string,predicate:string) =>requests.get<Profile[]>(`/follow/${username}?predicate=${predicate}`),
    listActivities:(username:string,predicate:string) =>requests.get<UserActivity[]>(`/profiles/${username}/activities?predicate=${predicate}`)

}//end Profiles

const agent={
    Activities,
    Account,
    Profiles
}

export default agent;