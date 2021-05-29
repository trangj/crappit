import { BigIntType, Collection, Entity, ManyToMany, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { Topic } from "./Topic";

@Entity()
export class User extends BaseEntity {
    @Property({ unique: true })
    username!: string

    @Property()
    password!: string

    @Property({ unique: true })
    email!: string

    @ManyToMany(() => Topic, topic => topic.followers, { owner: true })
    topicsFollowed = new Collection<Topic>(this)

    @ManyToMany(() => Topic, topic => topic.moderators, { owner: true })
    topicsModerated = new Collection<Topic>(this)

    @Property({ nullable: true })
    resetPasswordToken?: string

    @Property({ type: BigIntType, nullable: true })
    resetPasswordExpires?: number

    constructor(username: string, password: string, email: string) {
        super()
        this.username = username
        this.password = password
        this.email = email
    }
}