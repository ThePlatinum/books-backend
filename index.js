require('dotenv').config({path: './configs/config.env'})
const express = require('express')
const cors = require('cors')
const app = express()

// Connect to the database object
const { MongoClient } = require('mongodb');
const uri = process.env.MONGO_URI

const PORT = process.env.PORT || 5000
app.use(cors())
app.use(express.json())

app.get('/', (req, res)=>{
  res.send('Server is working fine')
})

app.get('/categories', (req, res)=>{

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true , connectTimeoutMS: 50000, keepAlive: 1});
const collection = client.db("sample_books").collection("book_details")
  let agg = [
    {
      '$unwind': {
        'path': '$categories'
      }
    }, {
      '$group': {
        '_id': '$categories', 
        'count': {
          '$sum': 1
        }
      }
    }
  ]
  client.connect(err => {
    collection.aggregate(agg).toArray( (err,success)=>{
      if (err) throw err;
      res.json(success)
    })
  })
})

app.get('/books', (req, res)=>{
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true , connectTimeoutMS: 50000, keepAlive: 1});
  const collection = client.db("sample_books").collection("book_details")
  client.connect(err => {
    collection.find({}).toArray((err, result) => {
      if (err) throw err;
      res.json(result);
    });
  })
})


app.get('/getCategories/:categories', (req, res)=>{
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true , connectTimeoutMS: 50000, keepAlive: 1});
  const collection = client.db("sample_books").collection("book_details")
  client.connect(err => {
    collection.find({'categories':`${req.params.categories}`}).toArray((err, result) => {
      if (err) throw err;
      res.json(result);
    });
  })
})

app.get('/add', (req, res)=>{
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true , connectTimeoutMS: 50000, keepAlive: 1});
const collection = client.db("sample_books").collection("book_details")
  collection.insertMany([], (err,success)=>{
    if (err) throw err;
    res.json(success)
  })
})

app.get('/search/:keyword', (req, res)=>{
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true , connectTimeoutMS: 50000, keepAlive: 1});
const collection = client.db("sample_books").collection("book_details")
  let query = req.params.keyword
  let words = query.split(" ")
  words.forEach(i =>{
    console.log(i)
  })
  client.connect(err => {
    collection.find({'longDescription': { $regex: query} }).toArray((err, result) => {
      if (err) throw err;
      res.json(result);
    });
  })
})

app.listen(PORT, ()=>{})