import express from 'express'
import {db} from './db/connectionDb.js'
import dotenv from 'dotenv'
import  cookieParser from 'cookie-parser'
dotenv.config()
import userRouter from './users/routeUsers.js'
import adminRouter from './admin/adminRouter.js'
import cors from 'cors'
import { Server } from 'socket.io';;
const app = express()
const port = 3003
var server = app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })

const io = new Server(server,{cors: {
  origin: '*',
}});

app.use(cookieParser());
app.use('/uploads', express.static( './uploads'));
// app.use(express.static(__dirname));
app.set('view engine', 'ejs');
app.use(cors({ credentials:true, origin:'http://localhost:3000' }));

app.use(express.json());
 


let interval;
let users={}
io.on("connection", (socket) => {

  console.log(`New client connected ${socket.id}`);
  
  socket.on("disconnect", (socket) => {
    console.log(socket.id);
    console.log(`Client disconnected${socket}`);
   
  });
});

const getApiAndEmit = socket => {
 
  socket.emit("chezki", response);
};


app.use('/users',userRouter)
app.use('/admin',adminRouter)






