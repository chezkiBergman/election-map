import express from 'express'
import {db} from './db/connectionDb.js'
import {checkIfAdminAndAuth } from "./aute.js"
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
 

// io.on("connection", (socket) => {
//   getApiAndEmit(socket)

  
//   socket.on("disconnect", (socket) => {
//   //   socket.on('my message', (msg) => {
//   //     io.emit('my broadcast', `server: ${msg}`);
//   //   });
//     console.log(`Client disconnected${socket}`);
   
//   });
// });

// const getApiAndEmit = socket => {
 
//   socket.emit("message", 'משתמש חדש נכנס לאתר');
// };


app.use('/users',userRouter)
app.use('/admin',checkIfAdminAndAuth ,adminRouter)






