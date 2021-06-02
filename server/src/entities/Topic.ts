import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from ".";

@Entity()
export class Topic extends BaseEntity {
    @Column({ unique: true })
    title!: string

    @Column({ type: 'text' })
    description!: string

    @Column()
    image_url?: string

    @Column()
    image_name?: string

    @ManyToMany(() => User, user => user.topics_followed)
    followers: User[]

    @ManyToMany(() => User, user => user.topics_moderated)
    moderators: User[]

    @PrimaryGeneratedColumn()
    id!: number;

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
}