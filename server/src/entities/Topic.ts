import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from ".";

@Entity()
export class Topic extends BaseEntity {
    @Column({ unique: true })
    title!: string

    @Column({ type: 'text' })
    description!: string

    @Column()
    imageURL?: string

    @Column()
    imageName?: string

    @ManyToMany(() => User, user => user.topicsFollowed)
    followers: User[]

    @ManyToMany(() => User, user => user.topicsModerated)
    moderators: User[]

    @PrimaryGeneratedColumn()
    id!: number;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}