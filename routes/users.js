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

    const userId = new mongoose.mongo.ObjectID(res.locals.user.id);
    const users = await db.Users.aggregate([
        {$match: {_id: {$ne: userId}}},
        {$project: {firstName: 1, lastName: 1, imageUrl: 1}},
        {$sample: {size: +num}}
    ]);

    return res.json(users);
});

router.get('/:userId', isUserLoggedIn, async function(req, res) {
    try {
        const {userId} = req.params;

        const user = await db.Users.findById(userId, {password: 0})
                                        .populate('cars')
                                        .populate({
                                            path: 'posts', 
                                            populate: {
                                                path: 'comments',
                                                populate: {
                                                    path: 'user',
                                                    select: 'imageUrl firstName lastName'
                                                }
                                            }
                                        })
                                        .exec();
        if(!user) return res.status(400).json({error: "That user id doesn't exist"});

        return res.json(user);
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
        return res.json(user);
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
});

module.exports = router;