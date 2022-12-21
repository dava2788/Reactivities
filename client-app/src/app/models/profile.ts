import { User } from "./user";

export interface Profile{
    username:string;
    displayName:string;
    image?:string;
    bio?: string;
    photos?: Photo[];
    following:boolean;
    followersCount:number;
    followingCount:number;
}

export class Profile implements Profile{
    constructor(user:User){
        this.username=user.username;
        this.displayName=user.displayName;
        this.image=user.image;

    }//end constructor
}//end  class Profile implements Profile

export interface Photo{
    id:string;
    url:string;
    isMain:boolean;

}//end Photo interface

export interface UserActivity{
    id:string;
    title:string;
    category:string;
    date:Date;

}//end UserActivity interface