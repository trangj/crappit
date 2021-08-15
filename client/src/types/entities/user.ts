import { Template } from "./template";

export interface User extends Template {
    username: string,
    email: string,
    avatar_image_url: string,
    avatar_image_name: string,
    topics_followed: [{ title: string; }];
    reset_password_token: string,
    reset_password_expires: number;
    karma: number;
}