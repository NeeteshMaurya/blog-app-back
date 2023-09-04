const express = require('express')
const router = express.Router()
const {registerUser, loginUser,profile ,logout,post,getAllPosts, getSinglePost} = require('../controller/user')
const multer = require('multer')
const uploadMiddleware = multer({ dest: 'uploads/' });
const fs = require('fs');


router.post('/register',registerUser)
router.post('/login' , loginUser)
router.get('/profile', profile)
router.post('/logout', logout)
// ----------------POST-------------------------------
router.post('/post', uploadMiddleware.single('file'), post)
router.get('/getallposts',getAllPosts)
router.get('/post/:id', getSinglePost)

module.exports=router;