import { Column, Entity } from 'typeorm';
import { Template } from './Template';

@Entity()
export class NotificationType extends Template {
  @Column({ unique: true })
    type_name: string;

  @Column()
    description: string;
}
