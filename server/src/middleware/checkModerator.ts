import { Request, Response, NextFunction } from 'express';
import AppDataSource from '../dataSource';
import { Moderator, Topic } from '../entities';

export const canModTopic = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const topic = await AppDataSource.manager.findOne(
      Topic,
      { where: { title: req.params.topic } },
    );
    if (!topic) throw Error('Topic does not exist');
    const moderator = await AppDataSource.manager.findOne(
      Moderator,
      { where: { topic_id: topic.id, user_id: req.user.id } },
    );
    if (!moderator) throw Error('You are not a moderator');

    req.topic = topic;
    req.moderator = moderator;
    next();
  } catch (err) {
    res
      .status(403)
      .json({ status: { text: err.message, severity: 'error' } });
  }
};
