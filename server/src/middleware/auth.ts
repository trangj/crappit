import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express';

export const auth = (req: Request, res: Response, next: NextFunction) => {
	const token = req.headers.authorization;
	if (!token)
		res
			.status(401)
			.json({ status: { text: "You are not authorized", severity: "error" } });

	try {
		const decoded = jwt.verify(token, process.env.jwtSecret);
		req.user = decoded;
		next();
	} catch (e) {
		res
			.status(400)
			.json({ status: { text: "Token is not valid", severity: "error" } });
	}
};

export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
	const token = req.headers.authorization;
	if (token === "null") {
		req.user = { id: null, user: null };
		next();
	} else {
		const decoded = jwt.verify(token, process.env.jwtSecret);
		req.user = decoded;
		next();
	}
};