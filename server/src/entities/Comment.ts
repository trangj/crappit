import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent, UpdateDateColumn } from "typeorm";
import { User, Post } from ".";

@Entity()
@Tree('closure-table')
export class Comment extends BaseEntity {
    @Column({ type: 'text', nullable: true })
    content!: string

    // consider splitting this into author: string and authorId: number as filling relations in tree entities is not supported in typeorm
    @ManyToOne(() => User, { nullable: true })
    @JoinColumn([{ name: 'authorId', referencedColumnName: 'id' }])
    author!: User

    @ManyToOne(() => Post, post => post.comments, { nullable: true, onDelete: 'CASCADE' })
    post!: Post

    // wait a new release of typeorm to address the cascade on delete for tree entities
    @TreeParent()
    parent_comment?: Comment

    @TreeChildren()
    children: Comment[]

    @PrimaryGeneratedColumn()
    id!: number;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}