const express=require('express')
const router=express.Router();
const Memes=require('../Models/memes')
router.get('/memeroute',(req,res)=>{
    res.send('Meme route')
})

router.get('/memes',(req,res)=>{

    // const page=parseInt(req.query.page)
    const limit=parseInt(req.query.limit)
    Memes.paginate({}, { page: 1, limit: limit,sort:{ last_modified: -1 },})
    .then(memes=>{
        res.send(memes)
    })
   
})

router.post('/memes',(req,res)=>{

    const {owner,caption,image}=req.body;
    const newMeme=new Memes({
        owner,caption,image
    })

    newMeme.save()
    .then(savedMemes=>{
        res.status(200).send({
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