const express = require("express");
const router = express.Router();
const lodash = require("lodash");
const Post = require("../models/postModel");
const categoies = require("../models/PostCategory");

const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.get("/add", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("add-post", { User: req.user, Category: categoies });
  } else {
    res.redirect("/admin");
  }
});

router.post("/add", upload.single("image"), (req, res) => {
  // Define a JSONobject for the image attributes for saving to database
  const { title, content, category } = req.body;
  const newPost = new Post({
    title: title,
    content: content,
    image: req.file.path,
    category: category,
  });
  newPost.save();
  res.redirect("/admin");
});

router.get("/:postName", function (req, res) {
  var titleUrl = lodash.lowerCase(String(req.params.postName));
  Post.find(function (err, result) {
    result.forEach((element) => {
      var storedTitle = lodash.lowerCase(String(element.title));
      if (storedTitle === titleUrl) {
        res.render("post", { Post: element });
      }
    });
  });
});

module.exports = router;
