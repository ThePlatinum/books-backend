
const { MongoClient } = require('mongodb');
const uri = process.env.MONGO_URI
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let _db

module.exports = {
  connectToServer: function (callback) {
    client.connect(err => {
      const collection = client.db("test").collection("devices");
      //perform actions on the collection object
      //client.close();

      //if db connects rightly, then return it to the caller
      _db = client.db('sample_books')
      console.log('db',db)
      // else err
      return callback(err)
    });
  },

  getDb: function(){
    return _db
  }
}
