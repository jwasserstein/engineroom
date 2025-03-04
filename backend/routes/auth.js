const express                = require('express'),
	  router                 = express.Router({mergeParams: true}),
	  db                     = require('../models'),
	  bcrypt                 = require('bcrypt'),
	  {isUserLoggedIn}       = require('../middleware/auth'),
	  jwt                    = require('jsonwebtoken'),
	  {checkMissingFields}   = require('../utils'),
	  {CognitoIdentityClient, 
		GetOpenIdTokenForDeveloperIdentityCommand} = require('@aws-sdk/client-cognito-identity');

router.post('/signup', async function(req, res) {
	try {
		const missingFields = checkMissingFields(req.body, ['username', 'password', 'firstName', 'lastName']);
		if(missingFields.length){
			return res.status(400).json({error: 'Missing the following fields: ' + missingFields});
		}

		const username = req.sanitize(req.body.username);
		const password = req.sanitize(req.body.password);
		const firstName = req.sanitize(req.body.firstName);
		const lastName = req.sanitize(req.body.lastName);
		
		const existingUser = await db.Users.findOne({username: username});
		if(existingUser) return res.status(400).json({error: 'That username is already in use'});

		const user = await db.Users.create({
			username: username,
			password: password, // Password is salted/hashed in pre-save hook
			firstName: firstName,
			lastName: lastName,
			friends: ['60251c79d3f1260004db5452', '60257901e61a5d0004c81830', '60257c3fe61a5d0004c81832', '602586a9e61a5d0004c8183a']
		});

		const client = new CognitoIdentityClient({region: 'us-east-1'});
		const command = new GetOpenIdTokenForDeveloperIdentityCommand({
			IdentityPoolId: 'us-east-1:a5f8a152-c8b9-4a8a-9505-03dcd77f39b1',
			Logins: {
				'engineroom-backend': user.username
			}
		});
		const resp = await client.send(command);

		const token = jwt.sign({
			id: user._id,
			username: user.username,
			awsIdentityId: resp.IdentityId
		}, process.env.SECRET_KEY);
		const userObj = user.toObject();
		delete userObj.password;

		return res.status(201).json({
			id: user._id,
			username: user.username,
			users: [userObj],
			awsIdentityId: resp.IdentityId,
			awsToken: resp.Token,
			token
		});
	} catch (err) {
		return res.status(500).json({error: err.message});
	}
});

router.post('/signin', async function (req, res) {
	try {
		const missingFields = checkMissingFields(req.body, ['username', 'password']);
		if(missingFields.length){
			return res.status(400).json({error: 'Missing the following fields: ' + missingFields});
		}

		const username = req.sanitize(req.body.username);
		const password = req.sanitize(req.body.password);
		
		const user = await db.Users.findOne({username: username});
		if(!user){
			return res.status(401).json({error: "That username doesn't exist"});
		}
		const isMatch = await bcrypt.compare(password, user.password);
		if(isMatch){
			const client = new CognitoIdentityClient({region: 'us-east-1'});
			const command = new GetOpenIdTokenForDeveloperIdentityCommand({
				IdentityPoolId: 'us-east-1:a5f8a152-c8b9-4a8a-9505-03dcd77f39b1',
				Logins: {
					'engineroom-backend': user.username
				}
			});
			const resp = await client.send(command);

			const token = jwt.sign({
				id: user._id,
				username: user.username,
				awsIdentityId: resp.IdentityId
			}, process.env.SECRET_KEY);

			const userObj = user.toObject();
			delete userObj.password;
			return res.json({
				id: user._id,
				username: user.username,
				users: [userObj],
				awsIdentityId: resp.IdentityId,
				awsToken: resp.Token,
				token
			});
		} else {
			return res.status(401).json({error: 'Incorrect password'});
		}
	} catch (err) {
		return res.status(500).json({error: err.message});
	}
});

router.post('/changePassword', isUserLoggedIn, async function(req, res){
	try {
		const missingFields = checkMissingFields(req.body, ['currentPassword', 'newPassword', 'repeatNewPassword']);
		if(missingFields.length){
			return res.status(400).json({error: 'Missing the following fields: ' + missingFields});
		}
		if(req.body.newPassword !== req.body.repeatNewPassword){
			return res.status(400).json({error: 'New passwords must match'});
		}

		const currentPassword = req.sanitize(req.body.currentPassword);
		const newPassword = req.sanitize(req.body.newPassword);
	
		const user = await db.Users.findById(res.locals.user.id);
		const isMatch = await bcrypt.compare(currentPassword, user.password);
		if(!isMatch){
			return res.status(401).json({error: 'Incorrect password'});
		}
		user.password = newPassword; // pre-save hook will salt & hash
		user.save();
		
		const message = 'Successfully changed your password';
		return res.json({message});
	} catch (err) {
		return res.status(500).json({error: err.message});
	}
});

module.exports = router;