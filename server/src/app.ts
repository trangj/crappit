import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import { UserRouter, TopicsRouter, TopicRouter, PostsRouter, PostRouter, CommentRouter, ModerationRouter } from './routes';
import { createConnection } from "typeorm";

(async () => {
	const app = express();

	await createConnection();

	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
	app.use(cookieParser());
	app.use("/api/comment", CommentRouter);
	app.use("/api/post", PostRouter);
	app.use("/api/posts", PostsRouter);
	app.use("/api/topic", TopicRouter);
	app.use("/api/topics", TopicsRouter);
	app.use("/api/user", UserRouter);
	app.use("/api/moderation", ModerationRouter);

	app.listen(process.env.PORT || 5000, () =>
		console.log("Server started on port 5000...")
	);
})().catch(err => {
	console.log(err);
});
