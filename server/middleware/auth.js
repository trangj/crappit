const keys = require("../config/keys");
const jwt = require("jsonwebtoken");

function auth(req, res, next) {
	const token = req.header("x-auth-token");

	if (!token) res.status(401).json({ status: "You are not authorized" });

	try {
		const decoded = jwt.verify(token, process.env.jwtSecret);
		req.user = decoded;
		next();
	} catch (e) {
		res.status(400).json({ status: "Token is not valid" });
	}
}

module.exports = auth;
