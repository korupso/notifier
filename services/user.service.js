const { isValidID, User } = require('../helpers/db');

module.exports = {
    createUser: (username, cb) => User.create({ username }, (err, user) => cb(err, user)),
    getAllUsers: cb => User.find((err, users) => cb(err, users)),
    deleteUser: (idOrUsername, cb) => isValidID(idOrUsername) ? User.findByIdAndDelete(idOrUsername, (err, user) => cb(!err && !user ? "User with id \"" + idOrUsername + "\" does not exist" : err, user)) : User.findOneAndRemove({ username: idOrUsername }, (err, user) => cb(!err && !user ? "User with username \"" + idOrUsername + "\" does not exist" : err, user))
}