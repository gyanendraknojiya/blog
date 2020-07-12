require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const flash = require("connect-flash");
const bcrypt = require("bcrypt");

// routes import
const homeRoute = require("./routes/home");
const adminRoute = require("./routes/admin");
const postRoute = require("./routes/post");

const app = express();
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
mongoose.set("useCreateIndex", true);

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());
app.use(function (req, res, next) {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Database Connection
try{
  mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(app.listen(process.env.PORT, function () {
    console.log("Server is running at port " + process.env.PORT);
  }));
} catch(err){
  console.log(err)
}

app.use(passport.initialize());
app.use(passport.session());

// bcrypt saltRounds
const saltRounds = 10;

const User = require("./models/adminModel");

require("./config/passport.config")(passport, User);

// set routes
app.use("/", homeRoute);
app.use("/admin", adminRoute);
app.use("/posts", postRoute);

// app.get('/register', (req, res)=>{ res.render('register')})

// app.post('/register', (req, res)=>{
//     const {name, username, mobile, password} =req.body

//     bcrypt.genSalt(saltRounds, function (err, salt) {
//         bcrypt.hash(password, salt, function (err, hash) {
//           const newUser = new User({
//             name: name,
//             mobile: mobile,
//             username: username,
//             password: hash,
//             role: "admin",
//           });
//           newUser.save();
//         });
//         console.log("registered");
//         res.redirect("/admin");
//       });
// })


