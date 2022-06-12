import { Column, Entity, ManyToMany } from 'typeorm';
import { User } from '.';
import { Template } from './Template';

@Entity()
export class Topic extends Template {
  @Column({ unique: true })
    title!: string;

  @Column({ default: '' })
    headline?: string;

  @Column({ type: 'text' })
    description!: string;

  @Column()
    image_url?: string;

  @Column()
    image_name?: string;

  @Column({ default: '' })
    icon_image_url?: string;

  @Column({ default: '' })
    icon_image_name?: string;

  @ManyToMany(() => User, (user) => user.topics_followed)
    followers: User[];

  @ManyToMany(() => User, (user) => user.topics_moderated)
    moderators: User[];

  @Column({ type: 'int', default: 0 })
    number_of_followers: number;

  @Column({ type: 'jsonb', default: () => "'[]'", nullable: false })
    rules: {name: string, description: string, created_at: string}[];
}
