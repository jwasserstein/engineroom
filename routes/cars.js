const express              = require('express'),
      router               = express.Router({mergeParams: true}),
      db                   = require('../models'),
      {isUserLoggedIn}     = require('../middleware/auth'),
      {checkMissingFields} = require('../utils'),
      mongoose             = require('mongoose');

router.post('/', isUserLoggedIn, async function(req, res){
    try {
        const missingFields = checkMissingFields(req.body, ['name']);
		if(missingFields.length){
			return res.status(400).json({error: 'Missing the following fields: ' + missingFields});
        }

        const name = req.sanitize(req.body.name);
        const imageUrl = req.sanitize(req.body.imageUrl);
        const accelTime = req.sanitize(req.body.accelTime);
        const mods = req.sanitize(req.body.mods);
        const power = req.sanitize(req.body.power);
        const torque = req.sanitize(req.body.torque);

        const user = await db.Users.findById(res.locals.user.id);
        if(!user) return res.status(500).json({error: "Couldn't find your account"});
        
        const car = await db.Cars.create({
            user: res.locals.user.id,
            name,
            imageUrl,
            mods,
            accelTime,
            power,
            torque
        });

        user.cars.push(car._id);
        await user.save();

        return res.json({cars: [car], users: [user]});
    } catch(err) {
        return res.status(500).json({error: err.message});
    }
});

router.get('/random/:num', isUserLoggedIn, async function(req, res){
    try {
        const num = req.sanitize(req.params.num);
        if(!(+num > 0) || (+num % 1 !== 0)) {
            return res.status(400).json({error: 'Your must request a positive integer number of cars'})
        }

        const userId = new mongoose.mongo.ObjectID(res.locals.user.id);

        const cars = await db.Cars.aggregate([
            {$match: {user: {$ne: userId}}},
            {$sample: {size: +num}}
        ]);

        const carIds = cars.map(c => c._id);

        return res.json({randomCarIds: carIds, cars: cars});
    } catch(err) {
        return res.status(500).json({error: err.message});
    }
});

router.get('/', isUserLoggedIn, async function(req, res){
    try {
        const user = await db.Users.findById(res.locals.user.id);

        const queryIds = req.sanitize(req.query.ids);
        let ids = JSON.parse(queryIds);
        if(!ids.length) return res.status(400).json({error: "You must provide an array of car ids as a query string parameter called 'ids'"});
        ids = ids.map(i => mongoose.Types.ObjectId(i));

        const cars = await db.Cars.find({_id: {$in: ids}});

        return res.json({cars});
    } catch(err) {
        return res.status(500).json({error: err.message});
    }
});

module.exports = router;