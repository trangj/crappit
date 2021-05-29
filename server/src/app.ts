import express from "express";
import cors from "cors";
import { EntityManager, EntityRepository, MikroORM, RequestContext } from "@mikro-orm/core";
import { User, Post, Topic, Vote, Comment } from "./entities";
import { PostsRouter, UserRouter, TopicsRouter, TopicRouter } from './routes'

export const DI = {} as {
	orm: MikroORM,
	em: EntityManager,
	userRepo: EntityRepository<User>,
	commentRepo: EntityRepository<Comment>,
	postRepo: EntityRepository<Post>,
	topicRepo: EntityRepository<Topic>,
	voteRepo: EntityRepository<Vote>,
}

(async () => {
	const app = express();

	DI.orm = await MikroORM.init()
	DI.em = DI.orm.em
	DI.userRepo = DI.orm.em.getRepository(User)
	DI.commentRepo = DI.orm.em.getRepository(Comment)
	DI.postRepo = DI.orm.em.getRepository(Post)
	DI.topicRepo = DI.orm.em.getRepository(Topic)
	DI.voteRepo = DI.orm.em.getRepository(Vote)

	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use((req, res, next) => {
		RequestContext.create(DI.orm.em, next);
	});
	app.use(cors());
	// app.use("/api/comment", require("./routes/comment"));
	// app.use("/api/post", require("./routes/post"));
	app.use("/api/posts", PostsRouter);
	app.use("/api/topic", TopicRouter);
	app.use("/api/topics", TopicsRouter);
	// app.use("/api/moderation", require("./routes/moderation"));
	app.use("/api/user", UserRouter);

	app.listen(process.env.PORT || 5000, () =>
		console.log("Server started on port 5000...")
	);
})().catch(err => {
	console.log(err)
})
