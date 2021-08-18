const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
const requirelogin = require("../middleware/requireLogin");
const { JWT_SECRET } = require("../keys");
//router.get("/", (req, res) => { res.send("hello")})


router.get("/protected", requirelogin, (req, res) => {
  res.send("hello user");
})

router.post("/Signup", (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!email || !password || !name) {
    return res.status(422).json({ error: "please add all the fields" });
  }
  User.findOne({ email: email }) // IF USER EMAIL which we are getting from frontend IS PRESENT IN OUR email list
    .then((savedUser) => { // may be u can change it to user exists
      if (savedUser) {
        return res
          .status(422)
          .json({ error: "user already exists.please sign in" });
      }
      bcrypt.hash(password, 12).then((hashedpassword) => {//remember the function structure inEJS I.E,HASHEDPASSWORD IS PARAMETER
        //now if it is new user,then the data is ready to be saved 
        const user = new User({
          email,  //email:email
          password: hashedpassword,
          name,
          pic
        });
        user
          .save()//user is our schema model name and .save() is function in Mongoose which is used to save document to db
          .then((user) => { //if user is saved successfully
            
            res.json({ message: "saved" });
          })
          .catch((err) => {// jus in case error occurs while saving
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(422).json({ error: "please enter details" });
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (!savedUser) {
        return res.status(422).json({ error: "invalid details" });
      }
      bcrypt.compare(password, savedUser.password).then((doMatch) => {
        if (doMatch) {
         //  res.json({ message: "successfully signed in" });
          const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
          const { _id, name, email, followers, following, pic } = savedUser;
          res.json({
            token,
            user: { _id, name, email, followers, following, pic }
          });
        } else {
          return res.status(422).json({ error: "invalid password" });
        }
      })
    

    .catch((err) => { //catch for 'route'
      console.log(err);
    });
});
});
module.exports=router