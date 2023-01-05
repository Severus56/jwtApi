const{Schema, model} = require('mongoose')

const TodoSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    title: {type: String, required: true},
    desc: {type: String, required: true},
    key: {type: String}
})

module.exports = model('Todo', TodoSchema)