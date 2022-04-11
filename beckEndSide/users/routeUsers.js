import { json, Router } from "express";
import { User } from "../db/usersdb.js";
import { Comment } from "../db/commentOnMapDb.js";
import { compare, hash, tokenId, verifyToken } from "../aute.js";
import { sendEmail } from "./sendMail.js";
import crypto from "crypto"
import multer from 'multer'
import { createRequire } from "module";
import fs from "fs"
import jwt from "jsonwebtoken"
import { Donation } from "../db/donationDb.js";

const require = createRequire(import.meta.url);
const mapElection = require("../mapGeoJson/tableGeojson.json")



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    fs.mkdir('./uploads', (err) => {
      cb(null, './uploads');
    });
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});


const upload = multer({ storage: storage })
const userRouter = Router();


userRouter.get('/createNewToken',  async (req, res) => {
  try {
   
    const { authorization } = req.headers;
    const token = authorization.split(' ')[1];
   console.log(token);
    if(!token) return res.sendStatus(401);
    const jt =  jwt.verify(token, process.env.JWT_PASS);
    const accessToken = jwt.sign({id:jt.id}, process.env.JWT_PASS, { expiresIn:  "20m" });
    return res.json({accessToken})
   
  } catch (err) {
    if( err.message === 'jwt expired' ){
      const refreshToken = req.cookies.refreshToken;
      if(!refreshToken) return res.sendStatus(401);
      const  checkRefresh= jwt.verify(refreshToken, process.env.JWT_PASS)
      if(!checkRefresh)return res.sendStatus(403,"refreshToken expire");
    const accessToken = jwt.sign({id:checkRefresh.id}, process.env.JWT_PASS, { expiresIn:"20m" });
    console.log(accessToken);
     return res.json({ accessToken });
    }
    res.json({msg:err.message})
  }
})




userRouter.get('/getImageUser', verifyToken, async (req, res) => {
  try {
    const users = await User.findOne({ _id: req.user.id })
    if (!users) {
      return res.status(401).json({ msg: 'user not found' })
    }
    res.json(users)
  } catch (err) {
    console.log(err);
  }

})



userRouter.get('/getMapElectionGeoJson', verifyToken, (req, res) => {
  try {
    const { user } = req
    console.log(user)
    return res.status(200).send(mapElection);
  } catch (err) {
    console.log(err);
  }

})






userRouter.post("/singUp", upload.single('avatar'), async (req, res) => {
  try {
    const emailExists = await User.findOne({ email: req.body.email })
    if (emailExists) return res.status(400).send("Email already exists")

    const { name, email, password } = req.body
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
        return res.json({ user: user.toJSON(), msg: "אתה נדרש להפעיל את החשבון דרך תיבת" });
      }).catch(function (error) {
        console.log(error)
        res.send(error)   
      })
    } else {
      return res.status(401).json({ msg: 'require email, password and name' })
    }
  } catch (error) {
    console.log(error);
    res.send(error)
  }

});






userRouter.post("/setActivateUser", async (req, res) => {
  try {
    const { token } = req.body
    const user = await User.findOne({ resetPassOrActivateUserToken: token, resetPassOrActivateUserExpires: { $gt: Date.now() } })
    if (!user) {
      await User.deleteOne({ resetPassOrActivateUserToken: token }).then(function () {
        console.log("Data deleted");
      }).catch(function (error) {
        console.log(error);
      });
      return res.status(422).send({ msg: "לא הפעלת את החשבון במסגרת הזמן שהוקצב, הינך נדרש ל " })
    }
    user.activateUserByMail = "Active"
    user.resetPassOrActivateUserToken = undefined;
    user.resetPassOrActivateUserExpires = undefined;
    await user.save()
    res.status(200).json({ user: user.toJSON(), msg: 'שמך נקלט במערכת, ברוכים הבאים' })
  } catch (err) {
    console.log(err);
  }
})




userRouter.put("/editUser", verifyToken, upload.single('avatar'), async (req, res) => {
  const findUser = await User.findOne({ _id: req.user.id })
 
  const { name, email, password } = req.body
  if (name) findUser.name = name
  if (email){
  const emailExists = await User.findOne({ email: req.body.email })
  if (emailExists?.id !== req.user.id ) return res.status(400).send("אימייל זה כבר נמצא בשימוש")
  findUser.email = email
  }
  
  if (password) {
    const passExists = await User.findOne({ pass: req.body.password })
    if (!passExists?.id== req.user.id ) return res.status(400).send("סיסמה זאת כבר נמצאת בשימוש")
    const hashPassword = await hash(password)
    findUser.pass = hashPassword
  }
  findUser.image = req.file.filename,
    console.log(req.file);

  await findUser.save()
  findUser.pass = '****'
  res.json({ user: findUser.toJSON(), msg: "saved" });
});




userRouter.post("/singIn", async (req, res) => {
  try {
    const findUser = await User.findOne({ email: req.body.email })
    if (!findUser) {
      return res.status(401).json({ msg: 'אימייל לא נמצא' })
    }
    const checkPass = await compare(req.body.password, findUser.pass)
    if (!checkPass) {
      return res.status(401).json({ msg: 'הסיסמה לא קיימת במערכת' }) 
    }
    let newToken = tokenId(findUser.id)
    if (findUser.activateUserByMail != 'Active') {
      return res.status(401).json({ msg: "אתה נדרש להיכנס אל תיבת האימייל שלך ולהפעיל את החשבון" })
    }
    res.status(200).cookie('refreshToken',newToken.refreshToken, {  httpOnly: true,
      expires: new Date(Date.now() + 900000),
    
    }).json({ token: newToken.token, findUser: findUser })
   
   
   
    
  } catch (error) {
    console.error(error);
  }
});




userRouter.delete("/deleteAccount", verifyToken, (req, res) => {
  try {
  
    User.deleteOne({_id:req.user.id}, function(err, result) {

      if (err) {
        return res.send(err);
      } else {
      return  res.status(200).send({result,msg:"החשבון נמחק"});
      }
    });

  } catch (error) {
    res.send(error, 'Failed, please try again')

  }
})



userRouter.get("/getPostComment/:city", verifyToken, async (req, res) => {
  try {
    const getPost = await Comment.find({ city: req.params.city })

    const getUser = await User.find({ _id: getPost.map(userId => { return userId.user }) })
    if (!getPost) return res.status(404).send('not found post by this user')
  
    return res.send({ comments: getPost, user: getUser });
  } catch (error) {
    res.send(error, 'Failed, please try again')

  }
})




userRouter.post("/postComment", verifyToken, async (req, res) => {
  try {
    const nameAndImage = await User.findOne({ _id: req.user.id })
    const { comment, city } = req.body
    if (comment && city) {
      const commentOnResult = new Comment({
        city,
        comment,
        user: req.user.id,
        name: nameAndImage.name,
        image: nameAndImage.image
      })
      await commentOnResult.save()
      const postByUser = await Comment.find({ user: req.user.id })
      let sum = postByUser.length
      const user = await User.findOne({ _id: req.user.id })
      user.sumOfComments = sum;
      await user.save()

      return res.json({ post: commentOnResult, msg: "saved" });
    }
    return res.send("you must post a comment and city")

  } catch (error) {
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
    res.status(500).send('error', 'Failed to generate reset link, please try again')

  }

})



userRouter.post('/newPassword', async (req, res) => {
  try {
    const { password, token } = req.body
    const passwordHash = await hash(password)
    const user = await User.findOne({ resetPassOrActivateUserToken: token, resetPassOrActivateUserExpires: { $gt: Date.now() } })
    if (!user) return res.status(422).send({ msg: "קישור זה כבר אינו בתוקף" })
    user.pass = passwordHash
    user.resetPassOrActivateUserToken = undefined;
    user.resetPassOrActivateUserExpires = undefined;
    await user.save()

    res.status(200).json(user.toJSON())
  } catch (err) {
    console.log(err);
  }
})



userRouter.post("/donationAmount", verifyToken, async (req, res) => {
  try {

    var today = new Date()
    let formatDate = "יום: " + parseInt(today.getDay() + 1) + "-" + today.getDate() + '-' + parseInt(today.getMonth() + 1) + '-' + today.getFullYear()
    const findUser = await Donation.find({ user: req.user.id })
    let sum = 0;
    for (let i = 0; i < findUser.length; i++) {
      sum += findUser[i].donationAmount
    }
    const { pay } = req.body
    let donationHistory = 0;
    if (sum === 0) {
      donationHistory = pay
    } else {
      donationHistory = sum + Number(pay)
    }

    if (pay) {
      const newdDnation = new Donation({
        user: req.user.id,
        donationAmount: pay,
        date: formatDate,
        sumDonationHistory: donationHistory

      })

      await newdDnation.save()
      const userRef = await User.findOne({ _id: req.user.id })
      userRef.sumDonationHistory = newdDnation.sumDonationHistory
      await userRef.save()
      res.status(200).json(newdDnation.toJSON())
    } else {
      res.status(200).send({ msg: "לא התקבלה תרומה" })
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "תרומתך לא נרשמה במערכת,נסה שנית" })
  }
})



userRouter.get("/checkDonationAmount/:postOrDonate", verifyToken, async (req, res) => {
  try {
  
      const userName = await User.findOne({ _id: req.user.id })
      if (!userName) return res.status(404).send("לא נמצא משתמש זה במערכת")

      if (req.params.postOrDonate === 'comments') {
        const postByUser = await Comment.find({ user: userName.id })
        if (!postByUser.length) {
          return res.status(200).send({ msg: "משתמש זה עדיין לא הגיב" })
        }
        return res.status(200).json({ postByUser: postByUser })

      } if (req.params.postOrDonate === 'donations') {
        const findUser = await Donation.find({ user: userName.id })
        if (!findUser.length) {
          return res.status(200).send({ msg: "0.00" })
        }
        return res.status(200).json({ findUser: findUser })
      }
    
  } catch (err) {
    console.log(err);
    return res.send({ msg: err.message })
  }



})




export default userRouter


