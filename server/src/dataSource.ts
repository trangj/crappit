import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import * as dotenv from 'dotenv';
import path from 'path';
import {
  Comment, CommentVote, Follow, Moderator, Notification,
  NotificationSetting, NotificationType, Post, Topic, User, Vote,
} from './entities';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  namingStrategy: new SnakeNamingStrategy(),
  entities: [Comment, CommentVote, Follow, Moderator, Notification,
    NotificationSetting, NotificationType, Post, Topic, User, Vote],
  migrations: [path.join(__dirname, './migrations/*')],
  ssl: {
    rejectUnauthorized: false,
  },
});

export default AppDataSource;
