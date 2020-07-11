const express = require("express");
const router = express.Router();
const lodash = require("lodash");
const Post = require("../models/postModel");
const categoies = require("../models/PostCategory");
const paginate = require("express-paginate");

router.use(paginate.middleware(10, 20));

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

router.get("/", async (req, res, next) => {
  if (req.isAuthenticated()) {
  const [results, itemCount] = await Promise.all([
    Post.find({}).limit(req.query.limit).skip(req.skip).lean().exec(),
    Post.count({}),
  ]);
  const pageCount = Math.ceil(itemCount / req.query.limit);
  res.render("posts", {
    Posts: results,
    pageCount,
    itemCount,
    activePage: req.query.page,
    pages: paginate.getArrayPages(req)(3, pageCount, req.query.page),
  });
} else {
  res.redirect('/admin')
}
});

router.get("/add", (req, res) => {
  if (req.isAuthenticated()) {
    Post.find((err, Posts) => {
      if (err) {
        console.log(err);
      } else {
        res.render("add-post", {
          User: req.user,
          Category: categoies,
          Post: Posts,
        });
      }
    });
  } else {
    res.redirect("/admin");
  }
});

router.get("/edit/:id", (req, res) => {
  if (req.isAuthenticated()) {
    Post.findById(req.params.id, (err, Post) => {
      if (err) {
        console.log(err);
        res.redirect("/admin");
      } else if (!Post) {
        res.send("No Post found");
      } else {
        res.render("edit-post", {
          Post: Post,
          User: req.user,
          Category: categoies,
        });
      }
    });
  } else {
    res.redirect("/admin");
  }
});

router.get("/delete/:id", (req, res) => {
  if (req.isAuthenticated()) {
    Post.findByIdAndDelete(req.params.id, (err, done) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/posts");
      }
    });
  } else {
    res.redirect("/admin");
  }
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

router.post("/add", upload.single("image"), (req, res) => {
  // Define a JSONobject for the image attributes for saving to database
  const { title, content, category } = req.body;
  const date = new Date().toDateString();
  const newPost = new Post({
    title: title,
    content: content,
    image: req.file.path,
    category: category,
    Created_at: date,
    author: req.user.name,
  });
  newPost.save();
  res.redirect("/admin");
});

router.post("/edit", upload.single("image"), (req, res) => {
  const { title, content, category, postID } = req.body;
  const date = new Date().toDateString();
  if (req.file) {
    Post.findByIdAndUpdate(
      postID,
      {
        title: title,
        content: content,
        image: req.file.path,
        category: category,
        Edited_at: date,
      },
      (err, done) => {
        if (err) {
          res.send("something went wrong");
        } else {
          res.redirect("/admin");
        }
      }
    );
  } else {
    Post.findByIdAndUpdate(
      postID,
      {
        title: title,
        content: content,
        category: category,
        Edited_at: date,
      },
      (err, done) => {
        if (err) {
          res.send("something went wrong");
        } else {
          res.redirect("/admin");
        }
      }
    );
  }
});

module.exports = router;
