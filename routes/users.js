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

router.get('/', isUserLoggedIn, async function(req, res) {
    try {
        const ids = JSON.parse(req.query.ids);
        if(ids.length === 0) return res.status(400).json({error: "You must provide an array of user ids as a query string parameter called 'ids'"})

        const users = await db.Users.find({_id: {$in: ids.map(i => mongoose.Types.ObjectId(i))}}, {password: 0});
        const resp = {users};
        if(req.query.cars === 'true') {
            const carIds = [];
            users.forEach(u => u.cars.forEach(c => carIds.push(c)));
            const cars = await db.Cars.find({_id: {$in: carIds}});
            resp.cars = cars;
        }
        if(req.query.posts === 'true'){
            const postIds = [];
            users.forEach(u => u.posts.forEach(p => postIds.push(p)));
            const posts = await db.Posts.find({_id: {$in: postIds}}).populate('comments');
            resp.posts = posts;

            const existingUserIds = new Set(ids);
            const additionalUserIds = [];
            posts.forEach(p => {
                if(!existingUserIds.has(p.user.toString())) additionalUserIds.push(p.user);
                p.comments.forEach(c => {
                    if(!existingUserIds.has(c.user.toString())) additionalUserIds.push(c.user);
                });
            });
            const additionalUsers = await db.Users.find({_id: {$in: additionalUserIds}}, {password: 0});
            resp.users = resp.users.concat(additionalUsers);
        }

        return res.json(resp);
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

        const userObj = user.toObject();
        delete userObj.password;

        return res.json({users: [userObj]});
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
});

module.exports = router;