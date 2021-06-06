import express from "express";
import cors from "cors";
import { UserRouter, TopicsRouter, TopicRouter, PostsRouter, PostRouter, CommentRouter, ModerationRouter } from './routes';
import { createConnection } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

(async () => {
	const app = express();

	await createConnection({
		type: 'postgres',
		entities: ["dist/entities/**/*.js"],
		migrations: ["dist/migration/**/*.js"],
		url: process.env.DATABASE_URL,
		namingStrategy: new SnakeNamingStrategy(),
		ssl: {
			rejectUnauthorized: false
		}
	});

	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(cors());
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
