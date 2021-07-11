import express from 'express';
import { optionalAuth } from '../middleware/auth';
import { Comment } from '../entities';

const router = express.Router();

const createCommentThread = (id: any, comments: Comment[]): any => {
    return comments.filter(({ parent_comment_id }) => parent_comment_id == id)
        .map(({ id, parent_comment_id, ...rest }) => ({ id, ...rest, children: createCommentThread(id, comments) }));
};

// @route   GET /api/comments/:id
// @desc    Get comments for a post
// @access  Public

router.get('/:id', optionalAuth, async (req, res) => {
    try {
        const comments = await Comment.query(`
			select
			c.*,
			u.username author,
			cv.value user_vote
			from comment c
			left join "user" u on c.author_id = u.id
			left join comment_vote cv on c.id = cv.comment_id and cv.user_id = $1
			where c.post_id = $2
            order by 
				(case when $3 = 'vote' then c.vote end) desc,
				(case when $3 = 'created_at' then c.created_at end) desc,
				(case when $3 = '' then c end) desc
		`, [req.user.id, req.params.id, req.query.sort]);
        res.status(200).json({ comments: createCommentThread(null, comments) });
    } catch (err) {
        res.status(400).json({
            status: { text: err.message, severity: "error" },
        });
    }
});

export const CommentsRouter = router;