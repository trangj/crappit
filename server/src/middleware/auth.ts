import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express';

export const auth = (req: Request, res: Response, next: NextFunction) => {
	const token = req.headers.authorization;
	try {
		if (!token || token === 'undefined') throw Error("You are not authorized");
		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		req.user = decoded;
		next();
	} catch (err) {
		res
			.status(403)
			.json({ status: { text: err.message, severity: "error" } });
	}
};

export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
	const token = req.headers.authorization;
	try {
		if (!token || token === 'undefined') {
			req.user = { id: null, user: null };
			next();
		} else {
			const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
			req.user = decoded;
			next();
		}
	} catch (err) {
		res
			.status(403)
			.json({ status: { text: err.message, severity: "error" } });
	}
};