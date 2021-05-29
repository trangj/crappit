import { Cascade, Entity, ManyToOne, PrimaryKeyType, Property } from "@mikro-orm/core";
import { Post } from "./Post";
import { User } from "./User";

@Entity()
export class Vote {
    @ManyToOne({ primary: true })
    user!: User

    @ManyToOne({ primary: true })
    post!: Post

    @Property()
    value!: number

    [PrimaryKeyType]: [number, number]

    constructor(user: User, post: Post) {
        this.user = user
        this.post = post
    }
}