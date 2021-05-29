import { Collection, Entity, ManyToMany, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";

@Entity()
export class Topic extends BaseEntity {
    @Property({ unique: true })
    title!: string

    @Property({ type: 'text' })
    description!: string

    @ManyToMany(() => User, user => user.topicsFollowed)
    followers = new Collection<User>(this)

    @ManyToMany(() => User, user => user.topicsModerated)
    moderators = new Collection<User>(this)

    constructor(title: string, description: string) {
        super();
        this.title = title
        this.description = description
    }
}