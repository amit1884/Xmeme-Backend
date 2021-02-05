const mongoose=require('mongoose')

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

module.exports=mongoose.model("Memes",memeSchema);