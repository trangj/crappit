/* eslint-disable import/first */
import * as dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

import express from 'express';
import cors from 'cors';
import connectRedis from 'connect-redis';
import session from 'express-session';
import passport from './middleware/passport';
import {
  UserRouter, TopicsRouter, TopicRouter, PostsRouter, PostRouter,
  CommentRouter, ModerationRouter, CommentsRouter, SearchRouter,
  NotificationRouter,
} from './routes';
import redis from './common/redis';
import AppDataSource from './dataSource';

(async () => {
  const app = express();

  await AppDataSource.initialize();

  const RedisStore = connectRedis(session);

  app.set('trust proxy', 1);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));
  app.use(
    session({
      name: 'crappit_session',
      secret: process.env.SESSION_SECRET,
      cookie: {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.DOMAIN,
      },
      saveUninitialized: false,
      resave: false,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
    }),
  );
  app.use(passport.initialize());
  app.use('/api/comment', CommentRouter);
  app.use('/api/comments', CommentsRouter);
  app.use('/api/post', PostRouter);
  app.use('/api/posts', PostsRouter);
  app.use('/api/topic', TopicRouter);
  app.use('/api/topics', TopicsRouter);
  app.use('/api/user', UserRouter);
  app.use('/api/moderation', ModerationRouter);
  app.use('/api/search', SearchRouter);
  app.use('/api/notification', NotificationRouter);

  app.listen(process.env.PORT || 5000, () => console.log('Server started on port 5000...'));
})().catch((err) => {
  console.log(err);
});
