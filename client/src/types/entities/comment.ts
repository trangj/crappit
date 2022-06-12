import { Template } from './template';

export interface Comment extends Template {
    author: string,
    avatar_image_name: string,
    avatar_image_url: string,
    user_vote: number,
    content: string,
    vote: number,
    parent_comment_id: number,
    children: Comment[],
    is_edited: boolean,
    is_deleted: boolean,
    post_id: number;
    author_id: number;
}
