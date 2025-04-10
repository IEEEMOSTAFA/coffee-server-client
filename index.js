const express = require('express');
const cors = require('cors');
// for hide file
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// middleware
// "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]

// const serverless = require('serverless-http');
// module.exports = serverless(app);

// app.use(cors({ origin: 'http://localhost:5173'}));


// app.use(cors({
//   origin: [
//     'http://localhost:5173',
//     'https://your-frontend-deployed-url.vercel.app'
//   ],

//   credentials: true
// }));





app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://coffee-store-client.vercel.app', // Replace with your actual frontend URL
    'https://coffee-store-server-dav2wgaro-ieee-mostafas-projects.vercel.app'
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());


console.log(process.env.DB_USER)
console.log(process.env.DB_PASS)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9p6xc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

console.log(uri);

// const uri = "mongodb+srv://phitron:oz26a53YsEIJMc9c@cluster0.9p6xc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
// nodemon index.js
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const coffeeCollection = client.db("coffeeDB").collection("coffees");
    const userCollection = client.db("coffeeDB").collection("user");


    // Added Multiple Element:::
    app.get('/coffee', async(req,res) => {
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })


    // Update Element:::
    app.get('/coffee/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    })

    
// Add Single Element:::
    app.post('/coffee', async (req, res) => {
      const newCoffee = req.body;
      console.log(newCoffee);
      const result = await coffeeCollection.insertOne(newCoffee);
          res.send(result);
      
      // try {
      //     const coffeeCollection = client.db("coffeeDB").collection("coffees");
      //     const result = await coffeeCollection.insertOne(newCoffee);
      //     res.send(result);
      // } catch (error) {
      //     console.error(error);
      //     res.status(500).send({ message: "Failed to add coffee" });
      // }
  });

  app.put('/coffee/:id' , async(req, res) =>{
    const id = req.params.id;
    const filter = {_id: new ObjectId(id)};
    // const result = await coffeeCollection.updateOne(query)
    const options = {upsert: true};
    const updateCoffee = {
      $set: req.body
    }
    const result = await coffeeCollection.updateOne(filter,updateCoffee,options);
    res.send(result);
  })
//  Delete Single Element:::
  app.delete('/coffee/:id' , async(req , res) =>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)}
    const result = await coffeeCollection.deleteOne(query);
    res.send(result);
  })
  

  // User Related API
  // app.get('/user', async(req, res) =>{
  //   const cursor = userCollection.find();
  //   const users = await cursor.toArray();
  //   res.send(users);
  // })

  // In your backend (index.js)
app.get('/user', async(req, res) => {
  try {
    const cursor = userCollection.find();
    const users = await cursor.toArray();
    res.status(200).send(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send({ message: "Internal server error" });
  }
})
  app.post('/user', async(req, res) =>{
    const user = req.body;
    console.log(user);
    const result = await userCollection.insertOne(user);
    res.send(result);
  });

  app.patch('/user', async(req, res) => {
    const user = req.body;
    const filter = {email: user.email }
    const updateDoc = {
       $set: {
        lastLoggedAt: user.lastLoggedAt
       }
    }
    const result = await userCollection.updateOne(filter,updateDoc);
    res.send(result);
  })

  // Delete Operation

  app.delete('/user/:id',async(req,res) =>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)}
    const result = await userCollection.deleteOne(query);
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


// Server Testing::

app.get('/', (req,res) =>{
    res.send('Coffee Maker is running on port ')
})

app.listen(port, () => {
    console.log(`Coffee  Server is running on port: ${port}`)
})



// nodemon index.js













