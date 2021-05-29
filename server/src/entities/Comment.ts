import { Cascade, Collection, Entity, ManyToOne, OneToMany, Property, SerializedPrimaryKey } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { Post } from "./Post";
import { User } from "./User";

@Entity()
export class Comment extends BaseEntity {
    @Property({ type: 'text' })
    content!: string

    @ManyToOne()
    author!: User

    @ManyToOne()
    post!: Post

    @ManyToOne()
    parent_comment?: Comment

    @OneToMany(() => Comment, comment => comment.parent_comment, { cascade: [Cascade.REMOVE] })
    children = new Collection<Comment>(this)

    constructor(content: string, author: User, post: Post) {
        super();
        this.content = content
        this.author = author
        this.post = post
    }
}