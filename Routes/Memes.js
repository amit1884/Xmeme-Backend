const express=require('express')
const router=express.Router();
const Memes=require('../Models/memes')
router.get('/memeroute',(req,res)=>{
    res.send('Meme route')
})

router.get('/memes',(req,res)=>{

    const limit=parseInt(req.query.limit)
    Memes.paginate({}, { page: 1, limit: limit,sort:{ last_modified: -1 },})
    .then(memes=>{
        if(memes.docs.length>0)
        res.send(memes)
        else
        res.send({
            status:404,
            data:'Not Found'
        })
    })
    .catch(err=>{
        console.log(err)
        res.send({
            status:500,
            data:'Internal Server Error'
        })
    })
})

router.post('/memes',(req,res)=>{

    const {owner,caption,image}=req.body;
    const newMeme=new Memes({
        owner,caption,image
    })

    Memes.find({owner:owner,caption:caption,image:image})
    .then(
        data=>{
            if(data.length>0)
           {
            res.send({
                status:409,
                data:'Duplicate values exist'
            })
           }
           else{
            newMeme.save()
            .then(savedMemes=>{
                res.status(200).send({
                    id:savedMemes._id
                })
            })
            .catch(err=>{
                console.log(err)
                res.send({
                    satus:500,
                    message:'Internal Server Error',
                })
            })
           }
        }
    )
    
})


router.post('/memes/:id',(req,res)=>{
    const id=req.params.id;

    Memes.findByIdAndUpdate(id,{caption:req.body.caption,image:req.body.image,last_modified:new Date()})
    .then(updatedMeme=>{
        if(updatedMeme)
        {
            res.send({
                status:200,
                data:updatedMeme
            })
        }
        else
        res.send({
            status:404,
            data:'Not Found'
        })
    })
    .catch(err=>{
        console.log(err)
        res.send({
            status:500,
            data:'Internal Server Error'
        })
    })

})
module.exports=router;