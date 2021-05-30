import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User, Post } from ".";

@Entity()
export class Comment extends BaseEntity {
    @Column({ type: 'text', nullable: true })
    content!: string

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn([{ name: 'authorId', referencedColumnName: 'id' }])
    author!: User

    @ManyToOne(() => Post, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn([{ name: 'postId', referencedColumnName: 'id' }])
    post!: Post

    @Column({ nullable: true })
    parentCommentId: number

    @ManyToOne(() => Comment, comment => comment.children, { nullable: true, onDelete: "CASCADE" })
    parentComment?: Comment

    @OneToMany(() => Comment, comment => comment.parentComment)
    children: Comment[]

    @PrimaryGeneratedColumn()
    id!: number;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}