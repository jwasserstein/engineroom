require('dotenv').config();
const express       = require('express'),
	  app           = express(),
	  bodyParser    = require('body-parser'),
	  cors          = require('cors'),
	  authRoutes    = require('./routes/auth'),
	  carRoutes     = require('./routes/cars'),
	  {redirectToHTTPS} = require('./middleware');

app.use(redirectToHTTPS);
app.use(cors());
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use(express.static('public'));

app.use(function(req, res, next) {
	return res.status(404).json({error: 'Route not found'});
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));