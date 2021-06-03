import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User, Post } from ".";

@Entity()
export class Comment extends BaseEntity {
    @Column({ type: 'text', nullable: true })
    content!: string;

    @Column({ default: 0 })
    vote: number;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn([{ name: 'author_id', referencedColumnName: 'id' }])
    author!: User;

    @ManyToOne(() => Post, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn([{ name: 'post_id', referencedColumnName: 'id' }])
    post!: Post;

    @Column({ nullable: true })
    parent_comment_id: number;

    @ManyToOne(() => Comment, comment => comment.children, { nullable: true, onDelete: "CASCADE" })
    parent_comment?: Comment;

    @OneToMany(() => Comment, comment => comment.parent_comment)
    children: Comment[];

    @PrimaryGeneratedColumn()
    id!: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}