import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Comment, User } from ".";

@Entity()
export class CommentVote extends BaseEntity {
    @ManyToOne(() => User, user => user.id, { primary: true, onDelete: 'CASCADE' })
    @JoinColumn()
    user!: User

    @ManyToOne(() => Comment, comment => comment.id, { primary: true, onDelete: 'CASCADE' })
    @JoinColumn()
    comment!: Comment

    @Column()
    value!: 1 | 0 | -1
}