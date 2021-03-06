const express=require('express')
const cors=require('cors');
const mongoose=require('mongoose')
const Memes=require('./Models/memes')
const swaggerJsDoc=require('swagger-jsdoc')
const swaggerUI=require('swagger-ui-express')
require('dotenv').config()

// Setting the port number
const PORT=process.env.PORT||8081;


// Setting the environment
const environment=process.env.NODE_ENV||'development'
let DB_URL

// Checking environment for development or production
if(environment==='development')
DB_URL='mongodb://localhost/Xmeme'
else if(environment==='production')
DB_URL=process.env.MONGOURI

// Database Connection
mongoose.connect(DB_URL,{useNewUrlParser: true,useUnifiedTopology: true })
.then(()=>{
    console.log('databse connected')
})
.catch(()=>{
    console.log(' database not connected')
});

const app=express();
app.use(cors())
app.use(express.json())

// Defining the options for swagger-ui
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
//   Defining the route for swagger
  app.use('/swagger-ui',swaggerUI.serve,swaggerUI.setup(swaggerSpecification))

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
    const date=new Date()
    const {name,caption,url}=req.body;
    console.log(req.body)
    const newMeme=new Memes({
        name,caption,url,last_modified:date
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
    // Param
    const id=req.params.id;
    // Req.body
    const url=req.body.url
    const caption=req.body.caption

    // If both url and caption needs to be updated
    if(url!==undefined&&caption!==undefined)
    {
        Memes.findByIdAndUpdate(id,{caption:caption,url:url,last_modified:new Date()})
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
    
    }
    // If only url is updated
    else if(url!==undefined&&caption===undefined)
    {
        Memes.findByIdAndUpdate(id,{url:url,last_modified:new Date()})
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
    
    }
    // Only caption is updated
    else if(url===undefined&&caption!==undefined)
    {
        Memes.findByIdAndUpdate(id,{caption:caption,last_modified:new Date()})
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
    }
})

// Start the server
app.listen(PORT,(err)=>{
    if(err)
    console.log(err)
    else
    console.log('Server Running on port :'+PORT)
})