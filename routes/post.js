const express = require("express");
const router = express.Router();
const lodash = require("lodash");
const Post = require("../models/postModel");

router.get('/:postName', function(req, res) {
    var titleUrl = lodash.lowerCase(String(req.params.postName));
    Post.find(function(err, result) {
        result.forEach(element => {
            var storedTitle = lodash.lowerCase(String(element.title));
            if (storedTitle === titleUrl) {
                res.render('post', { Post: element });
            } 
        });
    });


});

module.exports = router;
