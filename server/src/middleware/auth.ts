import { Request, Response, NextFunction } from 'express';

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const { user } = req.session;
  try {
    if (!user) throw Error('You are not authorized');
    req.user = user;
    next();
  } catch (err) {
    res
      .status(403)
      .json({ status: { text: err.message, severity: 'error' } });
  }
};

export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  const { user } = req.session;
  try {
    if (user) {
      req.user = user;
      next();
    } else {
      req.user = { id: null };
      next();
    }
  } catch (err) {
    res
      .status(403)
      .json({ status: { text: err.message, severity: 'error' } });
  }
};
