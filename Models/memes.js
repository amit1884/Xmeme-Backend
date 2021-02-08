const mongoose=require('mongoose')
var mongoosePaginate = require('mongoose-paginate');
const memeSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    caption:{
        type:String,
        required:true
    },
    url:{
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