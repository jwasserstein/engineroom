const express                = require('express'),
	  router                 = express.Router({mergeParams: true}),
	  db                     = require('../models'),
	  {isUserLoggedIn}       = require('../middleware/auth'),
      mongoose               = require('mongoose');


router.get('/random/:num', isUserLoggedIn, async function(req, res){
    const {num} = req.params;

    if(!(+num > 0) || (+num % 1 !== 0)) { // !(+num > 0) is false if num <= 0 OR num = undefined
        return res.status(400).json({error: 'You must request a positive integer number of users'});
    }

    const user = await db.Users.findById(res.locals.user.id);
    
    const users = await db.Users.aggregate([
        {$match: {_id: {$nin: [...user.friends, user._id]}}},
        {$project: {password: 0}},
        {$sample: {size: +num}}
    ]);
    
    const userIds = users.map(u => u._id);

    return res.json({randomUserIds: userIds, users: users});
});

router.get('/:userId', isUserLoggedIn, async function(req, res) {
    try {
        const {userId} = req.params;

        const user = await db.Users.findById(userId, {password: 0});
        if(!user) return res.status(400).json({error: "That user id doesn't exist"});

        const cars = await db.Cars.find({_id: {$in: user.cars}});
        const posts = await db.Posts.find({_id: {$in: user.posts}})
                                        .populate('comments');

        const additionalUserIds = [];
        for(let i = 0; i < posts.length; i++){
            for(let j = 0; j < posts[i].comments.length; j++){
                if(!posts[i].comments[j].user.equals(user._id)) {
                    additionalUserIds.push(posts[i].comments[j].user);
                }
            }
        }
        const additionalUsers = await db.Users.find({_id: {$in: additionalUserIds}}, {password: 0});

        return res.json({users: [user, ...additionalUsers], cars: cars, posts: posts});
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
});

router.post('/:friendId/friend', isUserLoggedIn, async function(req, res){
    try {
        const {friendId} = req.params;
        
        const user = await db.Users.findById(res.locals.user.id);

        const numFriends = user.friends.length;
        user.friends = user.friends.filter(f => f.toString() !== friendId);
        if(user.friends.length === numFriends) {
            user.friends.push(friendId);
        }
        await user.save();
        return res.json({users: [user]});
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
});

module.exports = router;