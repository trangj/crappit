import { Cascade, Collection, Entity, Enum, ManyToOne, OneToMany, Property, SerializedPrimaryKey } from "@mikro-orm/core";
import { Comment } from "./Comment";
import { User } from "./User";
import { Topic } from './Topic'
import { BaseEntity } from "./BaseEntity";

@Entity()
export class Post extends BaseEntity {
    @Property()
    title!: string

    @Enum({ unique: true })
    type!: PostType

    @Property({ type: 'text' })
    content?: string

    @Property()
    imageURL?: string

    @Property()
    imageName?: string

    @OneToMany(() => Comment, comment => comment.post, { cascade: [Cascade.REMOVE] })
    comments = new Collection<Comment>(this)

    @ManyToOne()
    author!: User

    @ManyToOne()
    topic!: Topic

    constructor(title: string, type: PostType, author: User, topic: Topic) {
        super();
        this.title = title
        this.type = type
        this.author = author
        this.topic = topic
    }
}

export enum PostType {
    TEXT = 'text',
    URL = 'url',
    PHOTO = 'photo'
}