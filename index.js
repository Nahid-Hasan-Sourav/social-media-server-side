const express=require('express');
const jwt = require('jsonwebtoken');
const cors=require('cors');
const app=express();
const port=process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER);

// JFqdMp1Ulf5gU7W1
// social-user



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ehiaece.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// https://social-media-server-side.vercel.app

async function run(){
    try{
        const userCollection=client.db("socialDb").collection("allUser");

        // SAVE USER INFO AND GENERATE A TOKEN
        app.put('/user/:email', async(req,res)=>{
            const email=req.params.email
            const userInfo=req.body;
            const filter={email:email}
            const options={upsert:true}
            const updateDoc={
                $set:userInfo,
            }

            const result=await userCollection.updateOne(filter,updateDoc,options);
            console.log("Save user information :",result);
            const token=jwt.sign(userInfo,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1d'})
            console.log("Token :",token)
            res.send({result,token})

        })

    }
    finally{
       
    }

    
}

run()
.catch(err => console.error(err));


app.get('/', (req, res) => {
    res.send('This is social server-app server');
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})