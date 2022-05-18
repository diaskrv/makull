const mongoose = require('mongoose')

const Moderators = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true}
}, {collection: 'administrators'})

const model = mongoose.model('Moderators', Moderators)

module.exports = model