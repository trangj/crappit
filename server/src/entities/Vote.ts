import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Post, User } from ".";

@Entity()
export class Vote extends BaseEntity {
    @PrimaryColumn()
    user_id: number

    @PrimaryColumn()
    post_id: number

    @ManyToOne(() => User, user => user.id)
    @JoinColumn({ name: 'userId' })
    user!: User

    @ManyToOne(() => Post, post => post.id)
    @JoinColumn({ name: 'postId' })
    post!: Post

    @Column({ nullable: true })
    value!: 1 | 0 | -1
}