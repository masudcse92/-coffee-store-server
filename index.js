const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// Middleware 
app.use(cors());
app.use(express.json());

// MongoBd connection 
// coffeeMaster
// 5ICtNQFRSDJ3Okdz


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.izygpfg.mongodb.net/?retryWrites=true&w=majority`;
// const uri = "mongodb+srv://coffeeMaster:5ICtNQFRSDJ3Okdz@cluster0.izygpfg.mongodb.net/?retryWrites=true&w=majority";

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

    const coffeeCollection = client.db('coffeeBD').collection('coffee');
  
  // Read   
  app.get('/coffee', async(req, res) => {
    const cursor = coffeeCollection.find();
    const result = await cursor.toArray(cursor);
    res.send(result);
  })

  // Read update 
  app.get('/coffee/:id', async(req, res) => {
    const id = req.params.id;
    const query = {_id: new ObjectId(id)};
    const result = await coffeeCollection.findOne(query);
    res.send(result);
  })

  app.put('/coffee/:id', async(req, res) => {
    const id = req.params.id;
    const filter = {_id: new ObjectId(id)};
    const options = {upsert: true};
    const updatedCoffee = req.body;

    const coffee = {
      $set: {
        name: updatedCoffee.name,
        quantity: updatedCoffee.quantity,
        supplier: updatedCoffee.supplier,
        category: updatedCoffee.category,
        details: updatedCoffee.details,
        photo: updatedCoffee.photo
      }
    }
    const result = await coffeeCollection.updateOne(filter, coffee, options);
    res.send(result);

  })


// insert / data create / database
   app.post('/coffee', async(req, res) => {
      const newCoffee = req.body;
      console.log(newCoffee);
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);
   }) 

  // Delete 

  app.delete('/coffee/:id', async(req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }
    const result = await coffeeCollection.deleteOne(query);
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


// Server running 
app.get('/',(req, res) => {
    res.send('Coffe Store maker server is running');
})

app.listen(port, () => {
    console.log(`Coffee Server is running on port: ${port}`)
})