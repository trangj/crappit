import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Post, User } from ".";

@Entity()
export class Vote extends BaseEntity {
    @ManyToOne(() => User, user => user.id, { primary: true, onDelete: 'CASCADE' })
    @JoinColumn()
    user!: User

    @ManyToOne(() => Post, post => post.id, { primary: true, onDelete: 'CASCADE' })
    @JoinColumn()
    post!: Post

    @Column()
    value!: 1 | 0 | -1
}