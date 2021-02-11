const express = require('express'),
      router  = express.Router({mergeParams: true}),
      db      = require('../models'),
      {isUserLoggedIn} = require('../middleware/auth'),
      {checkMissingFields} = require('../utils');

router.post('/', isUserLoggedIn, async function(req, res){
    try {
        const missingFields = checkMissingFields(req.body, ['text']);
		if(missingFields.length){
			return res.status(400).json({error: 'Missing the following fields: ' + missingFields});
        }
        
        const {text} = req.body;
        const {postId} = req.params;

        const post = await db.Posts.findById(postId);
        if(!post) return res.status(400).json({error: "That post doesn't exist"});

        const comment = await db.Comments.create({
            text: text,
            post: postId,
            user: res.locals.user.id
        });
        post.comments.push(comment._id);
        await post.save();

        const populatedPost = await db.Posts.findById(postId).populate('comments');

        return res.json({posts: [populatedPost]});
    } catch(err) {
        return res.status(500).json({error: err.message});
    }
});

router.delete('/:commentId', isUserLoggedIn, async function(req, res){
    try {
        const {commentId, postId} = req.params;

        const comment = await db.Comments.findById(commentId);
        if(!comment) {
            return res.status(400).json({error: "That comment doesn't exist"});
        }
        if(comment.user.toString() !== res.locals.user.id) {
            return res.status(401).json({error: "You don't own that comment"});
        }

        await db.Comments.findByIdAndDelete(commentId);

        const post = await db.Posts.findById(postId);
        post.comments = post.comments.filter(c => c.toString() !== commentId);
        await post.save();

        const populatedPost = await db.Posts.findById(postId).populate('comments');
        
        return res.json({posts: [populatedPost]});
    } catch(err) {
        return res.status(500).json({error: err.message});
    }
});

module.exports = router;