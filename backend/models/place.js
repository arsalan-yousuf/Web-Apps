const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    image: {type: String, required: true},
    creator: {type: mongoose.Types.ObjectId, required: true, ref: 'users'}
})

module.exports = mongoose.model('places', placeSchema)