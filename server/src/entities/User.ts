import {
  Column, Entity, OneToMany,
} from 'typeorm';
import { Follow } from './Follow';
import { Template } from './Template';

@Entity()
export class User extends Template {
  @Column({ unique: true })
    username!: string;

  @Column({ nullable: true })
    password!: string;

  @Column({ unique: true })
    email!: string;

  @Column({ default: '' })
    avatar_image_url?: string;

  @Column({ default: '' })
    avatar_image_name?: string;

  @OneToMany(() => Follow, (follow) => follow.user)
    topics_followed: Follow[];

  @Column({ nullable: true })
    reset_password_token?: string;

  @Column({ type: 'bigint', nullable: true })
    reset_password_expires?: number;

  @Column({ nullable: true })
    google_id: string;

  @Column({ nullable: true })
    google_access_token: string;

  @Column({ type: 'int', default: 0 })
    karma: number;
}
