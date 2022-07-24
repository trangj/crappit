import {
  BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn,
} from 'typeorm';
import { User, NotificationType } from '.';

@Entity()
export class NotificationSetting extends BaseEntity {
  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn()
    user: User;

  @PrimaryColumn()
    user_id: number;

  @ManyToOne(() => NotificationType, (notification_type) => notification_type.id)
  @JoinColumn()
    notification_type: NotificationType;

  @PrimaryColumn()
    notification_type_id: number;

  @Column({ default: true })
    value: boolean;
}
