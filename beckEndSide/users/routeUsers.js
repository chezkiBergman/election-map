import { Router } from "express"; 
import { User } from "../db/usersdb.js";
import { Comment } from "../db/commentOnMapDb.js";
// import { PasswordReset } from "../db/passwordResetDb.js";
import { compare, hash, tokenId, verifyToken } from "../aute.js";
import { sendEmail } from "./sendMail.js";
import crypto from "crypto"
import multer from 'multer'
import { createRequire } from "module";
import fs from "fs"
import { Donation } from "../db/donationDb.js";

const require = createRequire(import.meta.url);
const mapElection = require("../mapGeoJson/tableGeojson.json")







const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    fs.mkdir('./uploads',(err)=>{
      cb(null, './uploads');
   });
 },
 filename: function(req, file, cb) {
  cb(null, Date.now() + file.originalname);
 }
});


const upload = multer({storage: storage})
const userRouter = Router();

userRouter.get('/checkExpiresIn',verifyToken ,async (req, res) => {
  try{
 if (req.user) {
  const findUser = await User.findOne({_id:req.user.id})
  res.status(200).json(findUser.toJSON())
 } 
  }catch(err){
   console.log(err);
  }
  

})

userRouter.get('/getImageUser',verifyToken ,async (req, res) => {
  try{

    // const {user} =req
    const users = await User.findOne({_id:req.user.id})
    if (!users) {
      return res.status(401).json({ msg: 'user not found' })
    }
  console.log(users);
    res.json(users)
  
  }catch(err){
   console.log(err);
  }
  

})

userRouter.get('/getMapElectionGeoJson',verifyToken , (req, res) => {
  try{
    const {user} =req
    return res.status(200).send(mapElection);
    // console.log(req.user);
  
   
  }catch(err){
   console.log(err);
  }
  

})

userRouter.get('/userInfo',  async (req, res) => {

  const users = await User.findOne(req.user._id)
  if (!users) {
    return res.status(401).json({ msg: 'user not found' })
  }

  res.json(users)

})


userRouter.post("/singUp",upload.single('avatar'), async (req, res) => {
  try{
  const emailExists = await User.findOne({ email: req.body.email })
  if (emailExists) return res.status(400).send("Email already exists")
 
  const { name, email, password }= req.body
  if (name && email && password) {
  const token = crypto.randomBytes(32).toString('hex');
    console.log(req.file);

  const hashPassword = await hash(password)
  const user = new User({
   image: req.file.filename,
    name,
    email,
    pass: hashPassword,
    resetPassOrActivateUserToken: token,
    resetPassOrActivateUserExpires: Date.now() + 3600000
  })
 
  await user.save().then(() => {
    /* Send email to user containing password reset link. */
    const activateLink = `http://localhost:3000/activate-newUser/${token}`
    console.log(activateLink)
    sendEmail({
      to: user.email, subject: 'Activating a new user', text: `Hi ${user.name}, here's your activation link: ${activateLink}. 
  If you did not request this link, ignore it.`})
  user.pass = '*****'
   return res.json({user:user.toJSON(),msg:"אתה נדרש להיכנס אל תיבת האימייל שלך ולהפעיל את החשבון"});
  }).catch(function (error)  {
    console.log(error)
    res.send(error)
    ;})
  }else{
    return res.status(401).json({ msg: 'require email, password and name' })
 
  }

  }catch(error){
console.log(error);
 res.send(error)
  }
 
});
userRouter.post("/setActivateUser",async (req,res)=>{
  try {
    const { token } = req.body
    const user = await User.findOne({ resetPassOrActivateUserToken: token, resetPassOrActivateUserExpires: { $gt: Date.now() } })
    if (!user) return res.status(422).send({msg: "Password reset token is invalid or has expired"})
    user.activateUserByMail ="Active"
    user.resetPassOrActivateUserToken = undefined;
    user.resetPassOrActivateUserExpires = undefined;
    await user.save()
    
    res.status(200).json(user.toJSON())





  } catch (err) {
    console.log(err);
  }
})
 
userRouter.put("/editUser",verifyToken ,upload.single('avatar'), async (req, res) => {
 
  console.log(req.user);
 const findUser = await User.findOne({_id:req.user.id})

  const { name, email, password }= req.body
  if(name) findUser.name =name
  if(email) findUser.email =email
 
  if(password){ const hashPassword = await hash(password)
     findUser.pass =hashPassword
    }
   findUser.image = req.file.filename,
    console.log(req.file);
 
  await findUser.save()
  findUser.pass = '****'
  res.json({user:findUser.toJSON(),msg:"saved"});
});



userRouter.post("/singIn", async (req, res) => {
  try {
    const findUser = await User.findOne({ email: req.body.email })
    if (!findUser) {
       
    return  res.status(401).json({ msg: 'אימייל לא נמצא' })
    }

    const checkPass = await compare(req.body.password, findUser.pass)
    if (!checkPass) {
      return res.status(401).json({ msg: 'הסיסמה לא קיימת במערכת' })
    }
    let newToken = tokenId(findUser.id)
   if (findUser.activateUserByMail !=  'Active') {
     return res.status(401).json({msg:"אתה נדרש להיכנס אל תיבת האימייל שלך ולהפעיל את החשבון"})
   }
    res.json({ token: newToken,findUser: findUser }).status(200)
  } catch (error) {
    console.error(error);
  }

});

userRouter.get("/getPostComment/:city",verifyToken,async(req,res)=>{
  try{
  const getPost = await Comment.find({city:req.params.city})


const getUser = await User.find({_id: getPost.map(userId=>{return userId.user})})
console.log(getUser);

   return res.send({comments:getPost,user:getUser});
  }catch(error){
    res.send(error, 'Failed, please try again')

  }
})


userRouter.post("/postComment",verifyToken,async(req,res)=>{
  try{
    const nameAndImage = await User.findOne({_id:req.user.id})
   const {comment,city}= req.body
   if (comment && city) {
    const commentOnResult = new Comment({
      city,
      comment,
      user: req.user.id,
      name: nameAndImage.name,
      image: nameAndImage.image
  })

   await commentOnResult.save()
  return res.json({post:commentOnResult,msg:"saved"});
   }
 return  res.send("you must post a comment and city")
  
    

  }catch(error){
    res.send(error, 'Failed, please try again')

  }
})


userRouter.post('/reset-password', async (req, res) => {
  /* Flash email address for pre-population in case we redirect back to reset page. */
  try {
    const { email } = req.body
    if (email) {
      const user = await User.findOne({ email: email })
      const token = crypto.randomBytes(32).toString('hex');
      user.resetPassOrActivateUserToken = token,
        user.resetPassOrActivateUserExpires = Date.now() + 3600000
      await user.save()
        .then(() => {

          /* Send email to user containing password reset link. */
          const resetLink = `http://localhost:3000/reset-confirm/${token}`
          console.log(resetLink)
          sendEmail({
            to: user.email, subject: 'Password Reset', text: `Hi ${user.name}, here's your password reset link: ${resetLink}. 
        If you did not request this link, ignore it.`})
          res.send(`${email}`)
        }).catch(console.error())

    } else {
      return res.status(401).json({ msg: 'email not valid' })
    }
  } catch (error) {
    res.send('error', 'Failed to generate reset link, please try again')

  }

})

userRouter.post('/newPassword', async (req, res) => {
  try {
    const { password, token } = req.body
    const passwordHash = await hash(password)
    const user = await User.findOne({ resetPassOrActivateUserToken: token, resetPassOrActivateUserExpires: { $gt: Date.now() } })
    if (!user) return res.status(422).send({msg: "Password reset token is invalid or has expired"})
    user.password = passwordHash
    user.resetPassOrActivateUserToken = undefined;
    user.resetPassOrActivateUserExpires = undefined;
    await user.save()
    
    res.status(200).json(user.toJSON())
  } catch (err) {
    console.log(err);
  }
})

userRouter.post("/donationAmount",verifyToken ,async (req,res) => {
  try{
    // const findUser = await Donations.findOne({user:req.user.id})
    const {pay} =req.body
    if (pay){ 
    const newdDnation =  new Donation({
      user: req.user.id,
      donationAmount: pay,
     
    })
    // findUser.donationAmount 
    // ? ( findUser.donationAmount = req.body.data +  findUser.donationAmount) : findUser.donationAmount = req.body.data
    await newdDnation.save()
    res.status(200).json(newdDnation.toJSON())
  }else{
    res.status(200).send({msg:"לא התקבלה תרומה"})
  }
  }catch(error){
  console.log(error);
  }
})
userRouter.get("/checkDonationAmount",verifyToken ,async (req,res) => {
try{
  if (req.user) {
   const findUser = await Donation.find({user:req.user.id})
  if (findUser) {
   res.status(200).json({findUser:findUser})
  }else{
    res.status(200).send({msg:"0.00"})
  }
 
  } 
   }catch(err){
    console.log(err);
   }

  })
  userRouter.get("/getAllUsers",verifyToken ,async (req,res) => {
    try{
      if (req.user) {
       const findUser = await User.findOne({_id:req.user.id})
      if (findUser.permissions === "admin") {
        const allUsers = await User.find({})
       res.status(200).json({users:allUsers})
      }else{
        res.status(200).send({msg:"אין לך הרשאה לנתונים אלו"})
      }
     
      } 
       }catch(err){
        console.log(err);
       }
    
      })
    

export default userRouter


