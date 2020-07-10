const express = require("express");
const router = express.Router();
const passport = require("passport");

const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' +file.originalname);
  },
});
const upload = multer({ storage: storage });

const fs = require("fs");

const Post = require("../models/postModel");

router.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("dashboard");
  } else {
    res.render("admin");
  }
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/admin");
});

router.post(
  "/",
  passport.authenticate("local", {
    failureRedirect: "/admin",
    successRedirect: "/admin",
    failureFlash: true,
  })
);

router.get("/post/add", (req, res) => {
    if (req.isAuthenticated()) {
  res.render("add-post");
    } else {
        res.redirect('/admin')
    }
});

router.post("/post/add", upload.single("image"), (req, res) => {
  // Define a JSONobject for the image attributes for saving to database
  const { title, content } = req.body;
  const newPost = new Post({
    title: title,
    content: content,
    image: req.file.path,
  });
  newPost.save();
  res.redirect("/admin");
});

module.exports = router;
