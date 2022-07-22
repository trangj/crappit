import {
  BaseEntity, Check, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn,
} from 'typeorm';
import { Post, User } from '.';

@Entity()
@Check('"value" >= -1 AND "value" <= 1')
export class Vote extends BaseEntity {
  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn()
    user!: User;

  @PrimaryColumn()
    user_id: number;

  @ManyToOne(() => Post, (post) => post.id, { onDelete: 'CASCADE' })
  @JoinColumn()
    post!: Post;

  @PrimaryColumn()
    post_id: number;

  @Column()
    value!: 1 | 0 | -1;
}
