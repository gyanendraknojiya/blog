const express = require('express')
const router = express.Router()
const Post = require('../models/postModel')

router.get('/', (req, res)=>{
    Post.find({}, (err, posts)=>{
        if(err){
            console.log(err)
        } else {

            res.render('home', {Post : posts})
        }
    })
})


module.exports = router;