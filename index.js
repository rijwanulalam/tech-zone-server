const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config();
const ObjectId = require('mongodb').ObjectID;
const port = process.env.PORT ||5010;


app.use(cors());
app.use(bodyParser.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ntps2.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const adminCollection = client.db("tech-zone").collection("admin");
  const ordersCollection = client.db("tech-zone").collection("orders");
  const reviewsCollection = client.db("tech-zone").collection("reviews");
  const servicesCollection = client.db("tech-zone").collection("services");


  app.get("/getServices", (req, res) => {
      servicesCollection.find()
      .toArray((err, services) => {
          res.send(services);
      })
  })
  app.post('/addServices', (req, res) => {
    const newService = req.body;
    servicesCollection.insertOne(newService)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
})

app.get("/getReviews", (req, res) => {
  reviewsCollection.find()
  .toArray((err, reviews) => {
      res.send(reviews);
  })
})

app.get("/allOrders", (req, res) => {
  ordersCollection.find()
  .toArray((err, orders) => {
      res.send(orders);
  })
})

app.post('/addReviews', (req, res) => {
  const newReview = req.body;
  reviewsCollection.insertOne(newReview)
  .then(result => {
      res.send(result.insertedCount > 0)
  })
})

app.post('/isAdmin', (req, res) => {
  const email = req.body.email;
  adminCollection.find({ email: email })
  .toArray((err, admin) => {
    res.send(admin.length > 0)
  })
})

app.post('/addNewAdmin', (req, res) => {
  const newAdmin = req.body;
  adminCollection.insertOne(newAdmin)
  .then(result => {
      res.send(result.insertedCount > 0)
  })
})

app.get('/checkout/:pId', (req , res) => {
  servicesCollection.find({ "_id": ObjectId(req.params.pId)})
  .toArray((err, items)=>{
    res.send(items[0])
  })
});

app.put('/update/:id', (req, res) => {
  ordersCollection.updateOne({ _id: ObjectId(req.params.id)},
  {
    $set: { orderStatus: "Completed"}
  }
  )
  .then(result => res.send(true))
})

app.post('/clientOrders', (req,res) => {
  const email = req.body.email;
  ordersCollection.find({email: email})
  .toArray((err, orders)=> {
    res.send(orders)
  })
})

app.post('/addOrder', (req, res) => {
  const order = req.body;
  ordersCollection.insertOne(order)
  .then(result => {
    res.send(result.insertedCount > 0)
  })

})


});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port || process.env.PORT)