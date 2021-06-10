import express from "express";
import { optionalAuth } from "../middleware/auth";
import { Post } from "../entities";

const router = express.Router();

// @route   GET /api/posts
// @desc    Get all posts
// @access  Public

router.get("/", optionalAuth, async (req, res) => {
	try {
		const posts = await Post.query(`
			select
			p.*,
			t.title topic,
			u.username author,
			v.value user_vote
			from post p
			inner join topic t on p.topic_id = t.id
			inner join "user" u on p.author_id = u.id
			left join vote v on p.id = v.post_id and v.user_id = $1
			order by 
				(case when $2 = 'vote' then p.vote end) desc,
				(case when $2 = 'created_at' then p.created_at end) desc
			limit 10 offset $3
		`, [req.user.id, req.query.sort, req.query.skip]);

		if (!posts) throw Error("Could not fetch posts");
		res.status(200).json({
			posts,
			nextCursor: posts.length
				? parseInt(req.query.skip as string) + posts.length
				: undefined,
		});
	} catch (err) {
		res.status(400).json({
			status: { text: err.message, severity: "error" },
		});
	}
});

// @route   GET /api/posts/:topic
// @desc    Get a topic
// @access  Public

router.get("/:topic", optionalAuth, async (req, res) => {
	try {
		const posts = await Post.query(`
			select
			p.*,
			t.title topic,
			u.username author,
			v.value user_vote
			from post p
			inner join topic t on p.topic_id = t.id
			inner join "user" u on p.author_id = u.id
			left join vote v on p.id = v.post_id and v.user_id = $1
			where t.title = $2
			order by
				(case when $3 = 'vote' then p.vote end) desc,
				(case when $3 = 'created_at' then p.created_at end) desc
			limit 10 offset $4
		`, [req.user.id, req.params.topic, req.query.sort, req.query.skip]);
		if (!posts) throw Error("No posts found");
		res.status(200).json({
			posts,
			nextCursor: posts.length
				? parseInt(req.query.skip as string) + posts.length
				: undefined,
		});
	} catch (err) {
		res.status(400).json({ status: { text: err.message, severity: "error" } });
	}
});

export const PostsRouter = router;
