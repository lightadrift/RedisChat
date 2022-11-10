import { Schema, Entity } from "redis-om";

 interface User {
  username: string;
  password: string;
  email: string;
  isOnline: boolean;
  avatarUrl: string;
  color: string;
}



class User extends Entity {}


export const Users = new Schema(User, {
    username: {type: "string", indexed: true},
    password: {type: "string"},
    email: {type: "string"},
    isOnline: {type: "boolean"},
    avatarUrl: {type: "string"},
    color: {type: "string"},
}, {
    dataStructure: "HASH"
})

