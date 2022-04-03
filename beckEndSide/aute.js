import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
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

export const verifyToken =  (req, res, next) => {
   const { authorization } = req.headers;
   const token = authorization.split(' ')[1];
   try {
        const jt =  jwt.verify(token, process.env.JWT_PASS);
  
        req.user = jt
        next()
   } catch (error) {
      return  res.status(401).send(error,"Unauthorized");
   }
  
   
}


export const tokenId = (id) => {
   var token = jwt.sign({ id }, process.env.JWT_PASS, { expiresIn:  "60m" });
   return token
}