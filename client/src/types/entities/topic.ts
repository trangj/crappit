import { Template } from "./template";

export interface Topic extends Template {
    user_followed_id: number,
    user_moderator_id: number,
    title: string,
    headline: string,
    description: string,
    image_url: string,
    image_name: string,
}