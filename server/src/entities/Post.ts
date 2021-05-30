import { Comment, User, Topic } from ".";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

enum PostType {
    TEXT = 'text',
    URL = 'url',
    PHOTO = 'photo'
}

@Entity()
export class Post extends BaseEntity {
    @Column()
    title!: string

    @Column({ type: 'enum', enum: PostType })
    type!: PostType

    @Column({ type: 'text' })
    content?: string

    @Column()
    imageURL?: string

    @Column()
    imageName?: string

    @ManyToOne(() => User, { eager: true })
    @JoinColumn([{ name: 'authorId', referencedColumnName: 'id' }])
    author!: User

    @ManyToOne(() => Topic, { eager: true })
    @JoinColumn([{ name: 'topicId', referencedColumnName: 'id' }])
    topic!: Topic

    @PrimaryGeneratedColumn()
    id!: number;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}