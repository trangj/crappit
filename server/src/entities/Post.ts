import { User, Topic } from ".";
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
    image_url?: string

    @Column()
    image_name?: string

    @Column({ default: 0 })
    vote: number

    @ManyToOne(() => User)
    @JoinColumn([{ name: 'author_id', referencedColumnName: 'id' }])
    author!: User

    @ManyToOne(() => Topic)
    @JoinColumn([{ name: 'topic_id', referencedColumnName: 'id' }])
    topic!: Topic

    @PrimaryGeneratedColumn()
    id!: number;

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
}