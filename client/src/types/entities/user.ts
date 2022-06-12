import { Template } from './template';

export interface User extends Template {
    username: string,
    email: string,
    avatar_image_url: string,
    avatar_image_name: string,
    topics_followed: { title: string, icon_image_url: string, icon_image_name: string }[];
    topics_moderated: {
        title: string,
        icon_image_url: string,
        icon_image_name: string,
        number_of_followers: number
    }[];
    reset_password_token: string,
    reset_password_expires: number;
    karma: number;
}
