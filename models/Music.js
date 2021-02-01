const {model,Schema} = require('mongoose');

const musicSchema = new Schema({
    
    name : String,
    songs : [
        {
        genre: String,
        composer:String,
        year:String
        }
    ],
    
    user : {
        type: Schema.Types.ObjectId,
        ref :'users'
    }
});

module.exports = model('Music' , musicSchema);
