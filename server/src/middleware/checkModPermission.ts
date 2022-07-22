import { Request, Response, NextFunction } from 'express';

export const canManageEverything = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.moderator.can_manage_everything) throw Error('You do not have permission.');
    next();
  } catch (err) {
    res
      .status(403)
      .json({ status: { text: err.message, severity: 'error' } });
  }
};

export const canManageSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.moderator.can_manage_settings) throw Error('You do not have permission.');
    next();
  } catch (err) {
    res
      .status(403)
      .json({ status: { text: err.message, severity: 'error' } });
  }
};

export const canManagePostsAndComments = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.moderator.can_manage_posts_and_comments) throw Error('You do not have permission.');
    next();
  } catch (err) {
    res
      .status(403)
      .json({ status: { text: err.message, severity: 'error' } });
  }
};
