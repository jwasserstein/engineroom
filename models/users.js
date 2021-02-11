const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	joinDate: {
		type: Date,
		default: Date.now
	},
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	bio: {
		type: String,
		default: "I don't have a bio!"
	},
	imageUrl: {
		type: String,
		default: 'https://engineroom.s3.amazonaws.com/default-profile.png'
	},
	cars: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'car'
	}],
	posts: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'post'
	}],
	friends: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user'
	}]
});

userSchema.pre('save', async function(next){
	if(!this.isModified('password')){
		return next();
	}
	this.password = await bcrypt.hash(this.password, 10);
	return next();
});

module.exports = mongoose.model('user', userSchema);