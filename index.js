const express = require('express')

const cors=require('cors')
const app = express()
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 3000


//middleware
app.use(express.json());
app.use(cors());
const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@web-projects.djmog22.mongodb.net/?appName=web-projects`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    //create a collection for zap-shift-projects

    const db=client.db('zap_shift_db');
    const parcelsCollection=db.collection('parcels');


    //------------parcels APIes--------------------


    //get api
    app.get('/parcels',async(req,res)=>{
     const query={}
     const {email}=req.query;

     if(email){
        query.senderEmail=email;
     }

    const options={sort:{createdAt:-1}}

     const cursor=parcelsCollection.find(query,options);
     const result=await cursor.toArray();
     res.send(result)
    })

    //post api

    app.post('/parcels',async(req,res)=>{
        const parcel=req.body;
        //parcel created time
        parcel.createdAt=new Date();
        const result=await parcelsCollection.insertOne(parcel);
        res.send(result)
    })


    //delete api
    app.delete('/parcels/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id:new ObjectId(id)}

      const result=await parcelsCollection.deleteOne(query);
      res.send(result);
    })









    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
  res.send('Zap is Shifting Shifting!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
