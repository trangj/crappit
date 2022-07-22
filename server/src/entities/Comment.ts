/* eslint-disable no-use-before-define */

import {
  Column, Entity, JoinColumn, ManyToOne, OneToMany,
} from 'typeorm';
import { User, Post } from '.';
import { Template } from './Template';

@Entity()
export class Comment extends Template {
  @Column({ type: 'text', nullable: true })
    content!: string;

  @Column({ default: 0 })
    vote: number;

  @ManyToOne(() => User)
  @JoinColumn([{ name: 'author_id', referencedColumnName: 'id' }])
    author!: User;

  @Column({ nullable: true })
    author_id: number;

  @ManyToOne(() => Post, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'post_id', referencedColumnName: 'id' }])
    post!: Post;

  @Column({ nullable: true })
    post_id: number;

  @Column({ nullable: true })
    parent_comment_id: number;

  @ManyToOne(() => Comment, (comment) => comment.children, { nullable: true, onDelete: 'CASCADE' })
    parent_comment?: Comment;

  @OneToMany(() => Comment, (comment) => comment.parent_comment)
    children: Comment[];

  @Column({ default: false })
    is_edited: boolean;

  @Column({ default: false })
    is_deleted: boolean;
}
