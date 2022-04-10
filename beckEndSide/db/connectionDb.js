import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config() 


 const CONNECTION =process.env.CONNECTIONDB_URI
mongoose.connect(CONNECTION, 
{useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
export  const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connected");
});