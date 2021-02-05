const express=require('express')
const cors=require('cors');

require('dotenv').config()

const PORT=process.env.PORT||5000;

const mongoose=require('mongoose')

mongoose.connect('mongodb://localhost/Xmeme',{useNewUrlParser: true,useUnifiedTopology: true })
.then(()=>{
    console.log('databse connected')
})
.catch(()=>{
    console.log(' database not connected')
});

const app=express();
app.use(cors())
app.use(express.json())

app.use(require('./Routes/Memes'));


app.get('/',(req,res)=>{
    res.send('Welcome to Xmeme Api')
})



app.listen(PORT,(err)=>{
    if(err)
    console.log(err)
    else
    console.log('Server Running on port :'+PORT)
})