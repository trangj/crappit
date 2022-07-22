import {
  ManyToOne, JoinColumn, PrimaryColumn, Column, Entity, CreateDateColumn, BaseEntity,
} from 'typeorm';
import { Topic } from './Topic';
import { User } from './User';

@Entity()
export class Moderator extends BaseEntity {
  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn()
    user!: User;

  @PrimaryColumn()
    user_id: number;

  @ManyToOne(() => Topic, (topic) => topic.id, { onDelete: 'CASCADE' })
  @JoinColumn()
    topic!: Topic;

  @PrimaryColumn()
    topic_id: number;

  @Column({ default: true, nullable: false })
    can_manage_posts_and_comments!: boolean;

  @Column({ default: true, nullable: false })
    can_manage_settings!: boolean;

  @Column({ default: true, nullable: false })
    can_manage_everything!: boolean;

  @CreateDateColumn()
    created_at: Date;
}
