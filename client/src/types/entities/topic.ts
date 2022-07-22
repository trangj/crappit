import { Template } from './template';

export interface Rule {
    name: string,
    description: string,
    created_at: string,
}

export interface Moderator {
    username: string, user_id: number;
    can_manage_posts_and_comments: boolean,
    can_manage_settings: boolean,
    can_manage_everything: boolean
}

export interface Topic extends Template {
    user_followed_id: number,
    user_moderator_id: number,
    can_manage_posts_and_comments: boolean,
    can_manage_settings: boolean,
    can_manage_everything: boolean
    title: string,
    headline: string,
    description: string,
    image_url: string,
    image_name: string,
    icon_image_url: string,
    icon_image_name: string,
    number_of_followers: number;
    moderators: [Moderator];
    rules: Rule[]
}
