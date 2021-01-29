const express              = require('express'),
      router               = express.Router({mergeParams: true}),
      db                   = require('../models'),
      {isUserLoggedIn}     = require('../middleware/auth'),
      {checkMissingFields} = require('../utils');

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

        return res.json(post);
    } catch(err) {
        return res.status(500).json({error: err.message});
    }
});

module.exports = router;