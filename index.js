const express=require('express')
const cors=require('cors');
const Memes=require('./Models/memes')
const swaggerJsDoc=require('swagger-jsdoc')
const swaggerUI=require('swagger-ui-express')
require('dotenv').config()

const PORT=process.env.PORT||8081;

const mongoose=require('mongoose')

let DB_URL

if(process.env.NODE_ENV==='development')
DB_URL='mongodb://localhost/Xmeme'
else if(process.env.NODE_ENV==='production')
DB_URL=process.env.MONGOURI
console.log(DB_URL)
mongoose.connect(process.env.MONGOURI,{useNewUrlParser: true,useUnifiedTopology: true })
.then(()=>{
    console.log('databse connected')
})
.catch(()=>{
    console.log(' database not connected')
});

const app=express();
app.use(cors())
app.use(express.json())


const options = {
    swaggerDefinition: {
      info: {
        title: 'Xmeme API',
        version: '1.0.0',
      },
    },
    apis: ['index.js'],
  };
  
  const swaggerSpecification = swaggerJsDoc(options);
  app.use('/swagger-ui',swaggerUI.serve,swaggerUI.setup(swaggerSpecification))
//   console.log(swaggerSpecification)

app.get('/',(req,res)=>{
    res.send('Welcome to Xmeme Api')
})



/**
 * @swagger
 * /memes:
 *   get:
 *     description : Fetch all memes
 *     parameters:
 *     - name: limit
 *       description: Number of memes to be fetched
 *       in: query
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal Server Error
 */

// Route to get top 100 memes (with load more feature) 
app.get('/memes',(req,res)=>{

    const limit=parseInt(req.query.limit)
    Memes.paginate({}, { page: 1, limit: limit,sort:{ last_modified: -1 },})
    .then(memes=>{
        // console.log(memes)
        res.status(200).send(memes)
    })
    .catch(err=>{
        console.log(err)
        res.send({
            status:500,
            data:'Internal Server Error'
        })
    })
})

/**
 * @swagger
 * /memes:
 *   post:
 *     description : Add new meme
 *     parameters:
 *     - name: Input fields
 *       description: Name of the owner,caption and meme url
 *       in: body
 *       required: true
 *       type: string
 *     responses:
 *       201:
 *         description: Success
 *       409:
 *         description: Duplicate value exist
 *       500:
 *         description: Internal Server Error
 */

// Add the memes
app.post('/memes',(req,res)=>{

    const {name,caption,url}=req.body;
    console.log(req.body)
    const newMeme=new Memes({
        name,caption,url
    })

    Memes.find({name:name,caption:caption,url:url})
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
                res.status(201).send({
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

/**
 * @swagger
 * /memes/{id}:
 *   patch:
 *     description : Update meme
 *     parameters:
 *     - name: id
 *       description: Meme Id
 *       in: path
 *       required: true
 *       type: string
 *     - name: Fields to be updated
 *       description: Fields to be updated(url/caption/both)
 *       in: body
 *       required: true
 *       type: string
 *     responses:
 *       204:
 *         description: Updated Successfully
 *       404:
 *         description: Not Found
 */
// Update any meme

app.patch('/memes/:id',(req,res)=>{
    const id=req.params.id;

    Memes.findByIdAndUpdate(id,{caption:req.body.caption,url:req.body.image,last_modified:new Date()})
    .then(updatedMeme=>{
        if(updatedMeme)
        {
           res.send({
               status:204,
               data:"Updated successfully"
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



// Start the server
app.listen(PORT,(err)=>{
    if(err)
    console.log(err)
    else
    console.log('Server Running on port :'+PORT)
})