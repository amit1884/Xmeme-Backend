const mongoose=require('mongoose')
var mongoosePaginate = require('mongoose-paginate');
const memeSchema=new mongoose.Schema({
    owner:{
        type:String,
        required:true
    },
    caption:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    last_modified:{
        type:Date,
        default:new Date()
    }
})
memeSchema.plugin(mongoosePaginate);

module.exports=mongoose.model("Memes",memeSchema);