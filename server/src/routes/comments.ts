import express from 'express';
import { optionalAuth } from '../middleware/auth';
import { Comment } from '../entities';

const router = express.Router();

const createCommentThread = (comments: Comment[]): any => {
  const hashTable = Object.create(null);
  comments.forEach(comment => hashTable[comment.id] = {...comment, children: []});
  const dataTree: Comment[] = [];
  comments.forEach(comment => {
    if(comment.parent_comment_id) hashTable[comment.parent_comment_id].children.push(hashTable[comment.id])
    else dataTree.push(hashTable[comment.id])
  });
  return dataTree;
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
			u.avatar_image_url avatar_image_url,
			u.avatar_image_name avatar_image_name,
			cv.value user_vote
			from comment c
			left join "user" u on c.author_id = u.id
			left join comment_vote cv on c.id = cv.comment_id and cv.user_id = $1
			where c.post_id = $2
            order by 
				(case when $3 = 'top' then c.vote end) desc,
				(case when $3 = 'new' then c.created_at end) desc,
				(case when $3 = 'hot' or $3 = '' then c end) desc
		`, [req.user.id, req.params.id, req.query.sort]);
		res.status(200).json({ comments: createCommentThread(comments) });
	} catch (err) {
		res.status(400).json({
			status: { text: err.message, severity: "error" },
		});
	}
});

export const CommentsRouter = router;