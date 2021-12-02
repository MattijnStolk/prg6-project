let mongoose = require('mongoose')

let Schema = mongoose.Schema;

let carModel = new Schema(
    {
        owner : {
            type : String,
            required: true
        },
        brand : {
                type : String,
                required: true
            },
            model : {
                type : String,
                required: true
            },
            modifications : {
                type : String
            }
        
    }
)

module.exports = mongoose.model('Cars', carModel)