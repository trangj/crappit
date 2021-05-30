import express from "express";
import cors from "cors";
import { UserRouter, TopicsRouter, TopicRouter, PostsRouter, PostRouter, CommentRouter } from './routes'
import { createConnection } from "typeorm";

(async () => {
	const app = express();

	await createConnection()

	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(cors());
	app.use("/api/comment", CommentRouter);
	app.use("/api/post", PostRouter);
	app.use("/api/posts", PostsRouter);
	app.use("/api/topic", TopicRouter);
	app.use("/api/topics", TopicsRouter);
	app.use("/api/user", UserRouter);
	// app.use("/api/moderation", require("./routes/moderation"));

	app.listen(process.env.PORT || 5000, () =>
		console.log("Server started on port 5000...")
	);
})().catch(err => {
	console.log(err)
})
