const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        default: '/Users/jwasserstein/courses/web-dev/engineroom/frontend/src/images/default-car.png'
    },
    mods: {
        type: String,
        default: 'None'
    },
    accelTime: {
        type: String,
        default: 'N/A'
    },
    power: {
        type: String,
        default: 'N/A'
    },
    torque: {
        type: String,
        default: 'N/A'
    }
});

module.exports = mongoose.model('car', carSchema);