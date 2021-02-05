const express=require('express')
const router=express.Router();
const Memes=require('../Models/memes')
router.get('/memeroute',(req,res)=>{
    res.send('Meme route')
})

router.get('/memes',(req,res)=>{

    Memes.find({})
    .then(memes=>{
        res.send({
            status:1,
            message:'Memes fetched',
            data:memes
        })
    })
    .catch(err=>{
        console.log(err)
        res.send({
            satus:0,
            message:'Some Error Occurred',
        })
    })
})

router.post('/memes',(req,res)=>{

    const {owner,caption,image}=req.body;
    const newMeme=new Memes({
        owner,caption,image
    })

    newMeme.save()
    .then(savedMemes=>{
        res.satus(200).send({
            id:savedMemes._id
        })
    })
    .catch(err=>{
        console.log(err)
        res.send({
            satus:0,
            message:'Some Error Occurred',
        })
    })
})

module.exports=router;