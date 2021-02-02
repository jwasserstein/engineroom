const express              = require('express'),
      router               = express.Router({mergeParams: true}),
      db                   = require('../models'),
      {isUserLoggedIn}     = require('../middleware/auth'),
      {checkMissingFields} = require('../utils'),
      mongoose             = require('mongoose');

router.post('/', isUserLoggedIn, async function(req, res){
    try {
        const missingFields = checkMissingFields(req.body, ['text']);
		if(missingFields.length){
			return res.status(400).json({error: 'Missing the following fields: ' + missingFields});
        }
        
        const {text} = req.body;

        const user = await db.Users.findById(res.locals.user.id);
        if(!user) return res.status(500).json({error: "Couldn't find your account"});

        const post = await db.Posts.create({
            text,
            user: res.locals.user.id
        });
        user.posts.push(post._id);
        await user.save();

        const populatedPost = await db.Posts.findById(post._id);

        return res.json(populatedPost);
    } catch(err) {
        return res.status(500).json({error: err.message});
    }
});

router.post('/:postId/like', isUserLoggedIn, async function(req, res){
    try {
        const {postId} = req.params;
        
        const post = await db.Posts.findById(postId);
        const preFilterLikes = post.likers.length;
        post.likers = post.likers.filter(l => l.toString() !== res.locals.user.id);
        if(preFilterLikes === post.likers.length) {
            post.likers.push(res.locals.user.id);
        }
        await post.save();
        return res.json(post.likers);
    } catch(err) {
        return res.status(500).json({error: err.message});
    }
});

router.get('/', isUserLoggedIn, async function(req, res){
    try {
        const user = await db.Users.findById(res.locals.user.id);
        const posts = await db.Posts.find({user: {$in: [...user.friends, mongoose.Types.ObjectId(res.locals.user.id)]}}, null, {sort: {date: -1}})
                                    .populate('comments');

        const additionalUserIds = [];
        for(let i = 0; i < posts.length; i++){
            if(!posts[i].user.equals(user._id)) {
                additionalUserIds.push(posts[i].user);
            }
            for(let j = 0; j < posts[i].comments.length; j++){
                if(!posts[i].comments[j].user.equals(user._id)) {
                    additionalUserIds.push(posts[i].comments[j].user);
                }
            }
        }
        const additionalUsers = await db.Users.find({_id: {$in: additionalUserIds}}, {password: 0});

        return res.json({posts: posts, users: additionalUsers});
    } catch(err) {
        return res.status(500).json({error: err.message});
    }
});

module.exports = router;