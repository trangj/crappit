import { Request, Response, NextFunction } from 'express';
import { Topic } from '../entities';

export const isModerator = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const topic = await Topic.findOne({ title: req.params.topic }, { relations: ['moderators'] });
    if (!topic) throw Error('Topic does not exist');
    if (!topic.moderators.some((moderator) => moderator.id === req.user.id)) throw Error('You are not a moderator');

    req.topic = topic;
    next();
  } catch (err) {
    res
      .status(403)
      .json({ status: { text: err.message, severity: 'error' } });
  }
};
