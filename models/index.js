const mongoose = require('mongoose'),
	  Users    = require('./users');

const dbURI = process.env.MONGODB_URI || 'mongodb://localhost/engineroom';

mongoose.connect(dbURI, {
	useNewUrlParser: true, 
	useUnifiedTopology: true, 
	useFindAndModify: false, 
	keepAlive: true
});
mongoose.set('useCreateIndex', true);

module.exports = {Users};