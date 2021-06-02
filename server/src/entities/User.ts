import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Topic } from ".";

@Entity()
export class User extends BaseEntity {
    @Column({ unique: true })
    username!: string

    @Column()
    password!: string

    @Column({ unique: true })
    email!: string

    @ManyToMany(() => Topic, topic => topic.followers)
    @JoinTable()
    topics_followed: Topic[]

    @ManyToMany(() => Topic, topic => topic.moderators)
    @JoinTable()
    topics_moderated: Topic[]

    @Column({ nullable: true })
    reset_password_token?: string

    @Column({ type: 'bigint', nullable: true })
    reset_password_expires?: number

    @PrimaryGeneratedColumn()
    id!: number;

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
}