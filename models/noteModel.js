let mongoose = require('mongoose')

let Schema = mongoose.Schema;

let noteModel = new Schema(
    {
        title: {type: String},
        author: {type: String},
        body: {type: String}
    }
)

module.exports = mongoose.model('Note', noteModel)