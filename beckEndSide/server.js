import express from 'express'
import {db} from './db/connectionDb.js'
import dotenv from 'dotenv'
dotenv.config()
console.log(process.env.EMAIL_ADDRESS);
// import bodyParser from 'body-parser';
import userRouter from './users/routeUsers.js'
import cors from 'cors'
import path from "path"
import { sendEmail } from './users/sendMail.js';



const app = express()
const port = 3003
app.use('/uploads', express.static( './uploads'));
// app.use(express.static(__dirname));
app.set('view engine', 'ejs');
app.use(cors())
app.use(express.json());
 

app.use('/users',userRouter)
// try { 
//   throw 'myException'; // יוצר חריג 
// } 
// catch (e) { 
//   /*email exception object לכתובת דואר שצוינה*/ 
//  await sendEmail({to:process.env.EMAIL_ADDRESS,subject:"errormessage",text: e.toString()}) 
//   console.log(e); 
// }

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })