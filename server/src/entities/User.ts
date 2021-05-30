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
    topicsFollowed: Topic[]

    @ManyToMany(() => Topic, topic => topic.moderators)
    @JoinTable()
    topicsModerated: Topic[]

    @Column({ nullable: true })
    resetPasswordToken?: string

    @Column({ type: 'bigint', nullable: true })
    resetPasswordExpires?: number

    @PrimaryGeneratedColumn()
    id!: number;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}