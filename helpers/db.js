const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');

const { mongoConnection } = require('../config.json');

mongoose.connect(mongoConnection, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
mongoose.Promise = global.Promise;

isValidID = id => ObjectID.isValid(id);

module.exports = {
    isValidID,
    User: require('../models/user.model'),
    Device: require('../models/device.model')
};