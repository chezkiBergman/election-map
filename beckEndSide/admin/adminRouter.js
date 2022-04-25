import {  Router } from "express";
import { User } from "../db/usersdb.js";
import { Comment } from "../db/commentOnMapDb.js";
import { compare, hash } from "../aute.js";
import { validation } from "../db/validationDb.js";
import multer from 'multer'
import fs from "fs"
import { Donation } from "../db/donationDb.js";



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




adminRouter.put('/editUserByAdmin',  upload.single('avatar'), async (req, res) => {
  try {
    const { name, email, password } = req.body
    const payload = {
      name: name,
      email: email,
      pass: password,
    }
    const { error } = validation.validate(payload);
    if (error) {
      res.status(406);
      return res.json({ msg: error.message });
    }
     const findUser = await User.findOne({ email: email })
    if(!findUser) return res.status(404).send("לא נמצא משתמש זה במערכת")
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


adminRouter.get("/getAllUsers", async (req, res) => {
  try {
    const allUsers = await User.find({})
    res.status(200).json({ users: allUsers })

  } catch (err) {
    console.log(err);
  }

})


adminRouter.delete("/deleteAccountByAdmin/:user", (req, res) => {

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

adminRouter.get("/checkDonationAmount/:userName/:postOrDonate", async (req, res) => {
  try {
    if (req.params.userName) {
      const userName = await User.findOne({ email: req.params.userName })
      if (!userName) return res.status(404).send("לא נמצא משתמש זה במערכת")

      if (req.params.postOrDonate === 'comments') {
        const postByUser = await Comment.find({ user: userName.id })
        if (!postByUser.length) {
          return res.status(200).send({ msg: "משתמש זה עדיין לא הגיב" })
        }
        let sum = postByUser.length
        userName.sumOfComments = sum
        await userName.save()
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

adminRouter.delete("/postDelete/:comment", async (req, res) => {
  try {
    if (!req.params.comment) { return res.send("you must set comment as parameter") }
    const postByUser = await Comment.findOne({ comment: req.params.comment })
    if (!postByUser) { return res.status(403).send("comment not found") }
    const sumCommentsByUser = await Comment.find({ user: postByUser.user })
    console.log(sumCommentsByUser.length)
      const findUser = await User.findOne({ _id: postByUser.user })
    const deleteComment = await Comment.deleteOne({ comment: req.params.comment })
    if (deleteComment) {
      let sum = sumCommentsByUser.length-1
      findUser.sumOfComments = sum;
      await findUser.save()

      return res.status(200).send({sum});
    }

     return
  } catch (error) {
  console.log(error.message);

  }
})







export default adminRouter


