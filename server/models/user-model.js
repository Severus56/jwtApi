const{Schema, model} = require('mongoose')

const UserSchema = new Schema({
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    activated: {type: Boolean, defaultValue: false},
    activationLink: {type: String}
})

module.exports = model('user', UserSchema)