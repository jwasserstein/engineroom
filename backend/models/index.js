const mongoose = require('mongoose'),
	  Users    = require('./users'),
	  Posts    = require('./posts'),
	  Comments = require('./comments'),
	  Cars     = require('./cars');

const dbURI = process.env.MONGODB_URI || 'mongodb://localhost/engineroom';

mongoose.connect(dbURI, {
	useNewUrlParser: true, 
	useUnifiedTopology: true, 
	useFindAndModify: false, 
	keepAlive: true
});
mongoose.set('useCreateIndex', true);

module.exports = {Users, Posts, Comments, Cars};