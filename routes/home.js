const express = require("express");
const router = express.Router();
const Post = require("../models/postModel");
const paginate = require("express-paginate");

router.use(paginate.middleware(9, 20));

router.get("/", async (req, res, next) => {
  const [results, itemCount] = await Promise.all([
    Post.find({}).sort({Created_at: 1}).limit(req.query.limit).skip(req.skip).lean().exec(),
    Post.countDocuments({}),
  ]);
  const pageCount = Math.ceil(itemCount / req.query.limit);
  res.render("home", {
    Post: results,
    pageCount,
    itemCount,
    activePage: req.query.page,
    pages: paginate.getArrayPages(req)(3, pageCount, req.query.page),
  });
});

module.exports = router;
