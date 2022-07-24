import {
  BaseEntity, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn,
} from 'typeorm';
import { Topic, User } from '.';

@Entity()
export class Follow extends BaseEntity {
  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn()
    user!: User;

  @PrimaryColumn()
  @Index()
    user_id: number;

  @ManyToOne(() => Topic, (topic) => topic.id, { onDelete: 'CASCADE' })
  @JoinColumn()
    topic!: Topic;

  @PrimaryColumn()
  @Index()
    topic_id: number;

  @Column({ default: false, nullable: false })
    favorite?: boolean;
}
