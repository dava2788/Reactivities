import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { AppHistory } from "../..";

import { Activity } from "../models/activity";
import { User, UserFormValues } from "../models/user";
import { store } from "../stores/store";

const sleep =(delay:number)=>{
    return new Promise((resolve)=>{
        setTimeout(resolve,delay);
    });
}

axios.defaults.baseURL='http://localhost:5000/api';

axios.interceptors.request.use(config=>{
    const token = store.commonStore.token;
    if(token){config.headers!.Authorization=`Bearer ${token}`}
    return config;
})

axios.interceptors.response.use(async response=>{
    
    await sleep(1000);
    return response;
},(error:AxiosError)=>{
    const {data, status, config}:{data:any,status:number,config:AxiosRequestConfig<any>} = error.response!;
    switch (status) {
        case 400:
            if (typeof data=='string') {
                toast.error(data);
            }//END if (typeof data=='string')


            if (config.method==='get' && data.errors.hasOwnProperty('id')) {
                AppHistory.push("/NotFound");
            }//end if (config.method=='get' && data.errors.hasOwnProperty('id')) 

            if (data?.errors) {
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
            toast.error("unauthorised");
            break;
        case 404:
            toast.error("Not Found");
            AppHistory.push("/NotFound");
            break;
        case 500:
            store.commonStore.setServerError(data);
            AppHistory.push("/Server-Error");
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
    list:()=>requests.get<Activity[]>('/activities'),
    details:(id:string)=>requests.get<Activity>(`/activities/${id}`),
    create:(activity:Activity)=>requests.post<void>('/activities',activity),
    update:(activity:Activity)=>requests.put<void>(`/activities/${activity.id}`,activity),
    delete:(id:string)=>requests.del<void>(`/activities/${id}`)
}

const Account={
    current:()=>requests.get<User>('/account'),
    login:(user:UserFormValues)=>requests.post<User>('/account/login',user),
    register:(user:UserFormValues)=>requests.post<User>('/account/register',user)
}

const agent={
    Activities,
    Account
}

export default agent;