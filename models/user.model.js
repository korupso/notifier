const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var schema = new Schema({
    username: { type: String, required: true, unique: true }
});

schema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model('User', schema);