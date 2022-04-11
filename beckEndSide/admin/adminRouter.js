import { json, Router } from "express";
import { User } from "../db/usersdb.js";
import { Comment } from "../db/commentOnMapDb.js";
import { compare, hash, tokenId, verifyToken } from "../aute.js";
import { sendEmail } from "../users/sendMail.js"
import crypto from "crypto"
import multer from 'multer'
import { createRequire } from "module";
import fs from "fs"
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
const adminRouter = Router();



async function checkIfAdmin(req, res, next) {

  try {
    const findUser = await User.findOne({ _id: req.user.id })
    if (findUser.permissions === 'admin') {
      return next()
    }
    return res.status(403).send('אין לך הרשאה לפעולה זאת')

  } catch (error) {
    console.log(error);
    res.send(error)
  }

}



adminRouter.put('/editUserByAdmin', verifyToken, checkIfAdmin, upload.single('avatar'), async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (email) {
      const findUser = await User.findOne({ email: email })
    }
    if (name) findUser.name = name
    if (password) {
      const hashPassword = await hash(password)
      findUser.pass = hashPassword
    }
    findUser.image = req.file.filename,
      console.log(req.file);
    await findUser.save()
    findUser.pass = '****'
    res.json({ user: findUser.toJSON(), msg: "saved" });
  } catch (error) {

  }

});


adminRouter.get("/getAllUsers", verifyToken, checkIfAdmin, async (req, res) => {
  try {
    const allUsers = await User.find({})
    res.status(200).json({ users: allUsers })

  } catch (err) {
    console.log(err);
  }

})

adminRouter.delete("/deleteAccountByAdmin/:user", verifyToken, checkIfAdmin, (req, res) => {
  try {
    if (!req.params.user) {
      return res.send("you must set comment as parameter")
    }
    User.deleteOne({ email: req.params.user }, function (err, result) {

      if (err) {
        return res.send(err);
      } else {
        return res.status(200).send({ result, msg: "החשבון נמחק" });
      }
    });

  } catch (error) {
    res.send(error, 'Failed, please try again')

  }
})

adminRouter.get("/checkDonationAmount/:userName/:postOrDonate", verifyToken, checkIfAdmin, async (req, res) => {
  try {
    if (req.params.userName) {
      const userName = await User.findOne({ email: req.params.userName })
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
    }
  } catch (err) {
    console.log(err);
    return res.send({ msg: err.message })
  }



})

adminRouter.delete("/postDelete/:comment", verifyToken, checkIfAdmin, async (req, res) => {
  try {
    if (!req.params.comment) { return res.send("you must set comment as parameter") }
    const postByUser = await Comment.findOne({ comment: req.params.comment })
    const sumCommentsByUser = await Comment.find({ user: postByUser.user })
    console.log(sumCommentsByUser.length)
      const findUser = await User.findOne({ _id: postByUser.user })
    const deleteComment = await Comment.deleteOne({ comment: req.params.comment })
    if (deleteComment) {
      let sum = sumCommentsByUser.length-1
      findUser.sumOfComments = sum;
      await findUser.save()

      return res.status(200).send(sum);
    }


  } catch (error) {
    return res.sendStatus(403) 

  }
})







export default adminRouter


