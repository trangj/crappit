import {
  Column, Entity, OneToMany,
} from 'typeorm';
import { Follow } from './Follow';
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

  @OneToMany(() => Follow, (follow) => follow.topic)
    followers: Follow[];

  @Column({ type: 'int', default: 0 })
    number_of_followers: number;

  @Column({ type: 'jsonb', default: () => "'[]'", nullable: false })
    rules: {name: string, description: string, created_at: string}[];
}
