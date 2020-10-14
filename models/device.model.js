const { ObjectId } = require('mongoose');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: { type: String, required: true },
    owner: { type: ObjectId, ref: 'User' }
});

schema.set('toJSON', {
    transform: (doc, ret) => delete ret._id
});

module.exports = mongoose.model('Device', schema);