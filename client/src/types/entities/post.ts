/* eslint-disable no-shadow */
import { Template } from './template';
import { Comment } from './comment';

export enum PostType {
    TEXT = 'text',
    LINK = 'link',
    PHOTO = 'photo'
}

export interface Post extends Template {
    topic: string,
    author: string,
    user_vote: number,
    title: string,
    type: PostType,
    content: string,
    image_url: string,
    image_name: string,
    vote: number,
    number_of_comments: number,
    comments: Comment[],
    author_id: number,
    icon_image_url: string,
    icon_image_name: string,
}
