import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
import { User } from "./db/usersdb.js"
dotenv.config()



const SALT_ROUNDS = 1;
/**
 * 
 * @param {string} password 
 * @returns {Promise<string>}
 * 
 */


export async function hash(password) {
   const ashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

   return ashedPassword
}
export async function compare(reqPass, password) {
   const checkPass = await bcrypt.compare(reqPass, password)
   return checkPass
}


export async function checkIfAdminAndAuth(req, res, next) {

   try {
      const {authorization} = req.headers;
      const token = authorization.split(' ')[1];
      if (!token) return res.sendStatus(401);
      const jt = jwt.verify(token, process.env.JWT_PASS);
      req.user = jt
      const findUser = await User.findOne({ _id: req.user.id })
      if (findUser.permissions === 'admin') {
            next()
      }else{
         return res.status(403).send('אין לך הרשאה לפעולה זאת')
      }

         } catch (error) {
            if (error.message === 'jwt expired') {
               return res.status(401).send("jwt expired")
      
            }
            if (error.message === 'invalid token') {
               return res.status(401).send("invalid token")
      
            }
         }
      
        
      
    

}





 

export const verifyToken = (req, res, next) => {
   try {
   const {authorization} = req.headers;
   const token = authorization.split(' ')[1];
   if (!token) return res.sendStatus(401);
      const jt = jwt.verify(token, process.env.JWT_PASS);
      req.user = jt
      next()

   } catch (error) {
      if (error.message === 'jwt expired') {
         return res.status(401).send("jwt expired")

      }
      if (error.message === 'invalid token') {
         return res.status(401).send("invalid token")

      }
   }
}




export const tokenId = (id) => {
   let tokens = {}
   const token = jwt.sign({id}, process.env.JWT_PASS, {expiresIn:"1m"});
   const refreshToken = jwt.sign({id}, process.env.JWT_PASS, { expiresIn:"2h"})
   tokens.token = token
   tokens.refreshToken = refreshToken
   return tokens
}