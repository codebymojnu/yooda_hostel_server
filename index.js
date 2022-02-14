const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { ObjectId } = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const app = express()
app.use(bodyParser.json());
app.use(cors());

const port = 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jvd1e.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const foodsCollection = client.db("YoodaHostelMalik").collection("foods");
  const studentsCollection = client.db("YoodaHostelMalik").collection("students");
  const distributionsCollection = client.db("YoodaHostelMalik").collection("distributions");

  // POST Food Item //

  app.post('/addfood', (req, res) => {
    const item = req.body;
    foodsCollection.insertOne(item)
      .then(result => {
        res.send(result);
      })
  })

  // POST Students Data
  app.post('/addstudent', (req, res) => {
    const student = req.body;
    studentsCollection.insertOne(student)
      .then(result => {
        res.send(result);
      })
  })

  // POST Khabar khaowa student data

  app.post('/addDistribution', (req, res) => {
    const distribution = req.body;
    distributionsCollection.insertOne(distribution)
      .then(result => {
        res.send(result);
      })
  })


  // findOneAndUpdate active and inactive status
  app.put('/update-status/:id', async(req, res) => {
    const id = req.params.id;
    const filter = {_id: ObjectId(id)};
    const options = {upsert: true};
    const updateDoc = {
      $set: {
        status: req.body.status
      },
    };
    const result = await studentsCollection.findOneAndUpdate(filter, updateDoc, options)
    res.json(result);
  })
  
  // READ Food Items

  app.get('/api/foodItems', (req, res) => {
    foodsCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  })

  // Read Student Data
  app.get('/api/students', (req, res) => {
    studentsCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  })

  // Read Khabar Khaowa Student by today date

  app.get('/khaowaStudent', (req, res) => {
    const date = new Date().toLocaleString().substring(0, 9);
    distributionsCollection.find({}).filter({ date: date })
      .toArray((err, documents) => {
        res.send(documents);
      })
  })


  // Load Single Student Data by id
  app.get('/student/:id', (req, res) => {
    studentsCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err, documents) => {
      res.send(documents[0]);
    })
  })

  // Load Single Student by Roll
  app.get('/stu/:roll', (req, res) => {
    studentsCollection.find({roll: req.params.roll})
    .toArray((err, documents) => {
      res.send(documents[0]);
    })
  })

  // Delete single Food Items

  app.delete('/delete-food/:id', (req, res) => {
    foodsCollection.deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => {
        res.send(result);
      })
  })

  // Delete single student
  app.delete('/delete-student/:id', (req, res) => {
    studentsCollection.deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => {
        res.send(result);
      })
  })


  // first load single data on UI
  app.get('/item/:id', (req, res) => {
    foodsCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err, documents) => {
      res.send(documents[0]);
    })
  })

  // update product

  app.put('/update-product/:id', async(req, res) => {
    const id = req.params.id;
    const updatedItem = req.body;
    const filter = {_id: ObjectId(id)};
    const options = {upsert: true};
    const updateDoc = {
      $set: {
        name: updatedItem.name,
        price: updatedItem.price
      },
    };
    const result = await foodsCollection.updateOne(filter, updateDoc, options)
    res.json(result);
  })

  // update student

  app.put('/update-student/:id', async(req, res) => {
    const id = req.params.id;
    const updatedItem = req.body;
    const filter = {_id: ObjectId(id)};
    const options = {upsert: true};
    const updateDoc = {
      $set: {
        fullName: updatedItem.fullName,
        roll: updatedItem.roll,
        age: updatedItem.age,
        class: updatedItem.class,
        hall: updatedItem.hall
      },
    };
    const result = await studentsCollection.updateOne(filter, updateDoc, options)
    res.json(result);
  })
});


app.get('/', (req, res) => {
  res.send('I am working, continue to your work');
})

app.listen(process.env.PORT || port);