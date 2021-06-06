import { Column, Entity, JoinTable, ManyToMany } from "typeorm";
import { Topic } from ".";
import { Template } from "./Template";

@Entity()
export class User extends Template {
    @Column({ unique: true })
    username!: string;

    @Column()
    password!: string;

    @Column({ unique: true })
    email!: string;

    @ManyToMany(() => Topic, topic => topic.followers)
    @JoinTable({ name: 'follow' })
    topics_followed: Topic[];

    @ManyToMany(() => Topic, topic => topic.moderators)
    @JoinTable({ name: 'moderator' })
    topics_moderated: Topic[];

    @Column({ nullable: true })
    reset_password_token?: string;

    @Column({ type: 'bigint', nullable: true })
    reset_password_expires?: number;
}