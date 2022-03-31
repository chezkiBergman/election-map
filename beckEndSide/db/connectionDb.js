import mongoose from 'mongoose';


 const CONNECTION = "mongodb+srv://chezkiBerg:PV33WiDZdZ9V$$p@cluster0.mmlqo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
mongoose.connect(CONNECTION, 
{useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

export const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connected");
});