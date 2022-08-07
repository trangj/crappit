import {
  BaseEntity,
  CreateDateColumn, Entity, JoinColumn, ManyToOne, Column, PrimaryGeneratedColumn,
} from 'typeorm';
import {
  NotificationType, User, Post, Comment,
} from '.';

@Entity()
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn()
    id!: number;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipient_id', referencedColumnName: 'id' })
    recipient!: User;

  @Column()
    recipient_id: number;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sender_id', referencedColumnName: 'id' })
    sender!: User;

  @Column()
    sender_id: number;

  @ManyToOne(() => NotificationType, (notification_type) => notification_type.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'notification_type_id', referencedColumnName: 'id' })
    notification_type!: NotificationType;

  @Column()
    notification_type_id: number;

  @ManyToOne(() => Post, (post) => post.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id', referencedColumnName: 'id' })
    post!: Post;

  @Column({ nullable: true })
    post_id: number;

  @ManyToOne(() => Comment, (comment) => comment.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'comment_id', referencedColumnName: 'id' })
    comment!: Comment;

  @Column({ nullable: true })
    comment_id: number;

  @CreateDateColumn()
    sent_at: Date;

  @Column({ nullable: true })
    read_at: Date;

  @Column()
    body: string;

  @Column()
    title: string;

  @Column({ nullable: true })
    url: string;

  @Column({ default: '' })
    icon_url: string;

  @Column({ default: '' })
    icon_name: string;
}
