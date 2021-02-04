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

        return res.json({posts: [populatedPost]});
    } catch(err) {
        return res.status(500).json({error: err.message});
    }
});

router.post('/:postId/like', isUserLoggedIn, async function(req, res){
    try {
        const {postId} = req.params;
        
        const post = await db.Posts.findById(postId).populate('comments');
        const preFilterLikes = post.likers.length;
        post.likers = post.likers.filter(l => l.toString() !== res.locals.user.id);
        if(preFilterLikes === post.likers.length) {
            post.likers.push(res.locals.user.id);
        }
        await post.save();
        return res.json({posts: [post]});
    } catch(err) {
        return res.status(500).json({error: err.message});
    }
});

router.get('/', isUserLoggedIn, async function(req, res){
    try {
        const user = await db.Users.findById(res.locals.user.id);

        let posts, feedPostIds;
        if(req.query.ids){
            // if a query string of post ids /posts?ids=[xxx, yyy, zzz] is provided, respond with the requested posts
            let ids = JSON.parse(req.query.ids);
            if(!ids.length) return res.status(400).json({error: "You must provide an array of post ids as a query string parameter called 'ids'"});
            ids = ids.map(i => mongoose.Types.ObjectId(i));

            posts = await db.Posts.find({_id: {$in: ids}}).populate('comments');
        } else {
            // if no query string is provided, respond with most recent posts from user and their friends
            posts = await db.Posts.find({user: {$in: [...user.friends, mongoose.Types.ObjectId(res.locals.user.id)]}}, null, {sort: {date: -1}})
                                        .populate('comments');
            feedPostIds = posts.map(p => p._id);
        }

        const additionalUserIds = [];
        for(let i = 0; i < posts.length; i++){
            additionalUserIds.push(posts[i].user);
            for(let j = 0; j < posts[i].comments.length; j++){
                additionalUserIds.push(posts[i].comments[j].user);
            }
        }
        const additionalUsers = await db.Users.find({_id: {$in: additionalUserIds}}, {password: 0});

        const resp = {posts: posts, users: additionalUsers};
        if(feedPostIds) resp.feedPostIds = feedPostIds;

        return res.json(resp);
    } catch(err) {
        return res.status(500).json({error: err.message});
    }
});

module.exports = router;