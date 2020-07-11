const express = require("express");
const router = express.Router();
const passport = require("passport");
const Post = require("../models/postModel");
const Category = require("../models/PostCategory");


router.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    Post.find((err, posts) =>{
      res.render("dashboard", {
        User: req.user,
        Posts: posts.slice(0,10),
        Category: Category,
      })
    });
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

module.exports = router;
