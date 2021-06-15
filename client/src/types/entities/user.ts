import { Template } from "./template";

export interface User extends Template {
    username: string,
    email: string,
    topics_followed: [{ title: string; }];
    reset_password_token: string,
    reset_password_expires: number;
}