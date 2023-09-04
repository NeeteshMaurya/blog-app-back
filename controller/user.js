const { response } = require('express')
const User = require('../models/User')
const Post = require('../models/Post')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
// const multer = require('multer')
// const uploadMiddleware = multer({ dest: '.../routes/uploads/' });
const fs = require('fs');

const salt = bcrypt.genSaltSync(10)
const secret = 'awe34fvt5rv7bce4b6654b@3rb4v#vb6nbev3v5544vv'   //----random secret which is used to make jwt token
                                                                // this secret also used when we want to get data inside token(username and id) like
                                                                // like getProfile api
//--------Register user API-------------
async function registerUser(req, res){
    const data = req.body
    try {
        const user = await User.create({
            username:data.username,
            password: bcrypt.hashSync(data.password,salt),
        })
        res.json(user)
    } catch (e) {
        console.log(e)
        res.status(400).send({ e })
    }
}

//-------Login--------------------easiest example to use cookie---------------------
async function loginUser(req,res){
    const data = req.body
    const userDoc = await User.findOne({username: data.username})  //checking if there is any user with that username
    if(userDoc === null){                                  //-------------if username not exist
        res.status(400).json('Wrong credential')
    }else{                                                 //-------------if user exist then we will compare password
        const passOk = bcrypt.compareSync(data.password,userDoc.password)
        if(passOk ){
 // ----------------if we got user with correct password then then we will send Json web token to our browser in form of cookie
//------------------in token we are storing username and id as mentioned below
            jwt.sign({username:userDoc.username,id:userDoc._id}, secret, {}, (err, token)=>{
                if(err) throw err
                res.cookie('token',token).json({
                    id:userDoc._id,
                    username: userDoc.username
                })
            })
        }else{
            res.status(400).json('Wrong credential')
        }
    } 
}

//--------Profile------------
async function profile(req,res){
    const {token} = req.cookies
    try {
        await jwt.verify(token, secret, {}, (err, info)=>{
            if(err) throw err;
            res.json(info)
        })
    } catch (error) {
        res.json(error)
    }
}

//-----------Logout----------
async function logout(req,res){
    res.cookie('token','').json('ok')
}

// -----------POST And Get PosT------------------

async function post(req,res){
  const {originalname,path} = req.file;
  const parts = originalname.split('.');
  const ext = parts[parts.length - 1];
  const newPath = path+'.'+ext;
  fs.renameSync(path, newPath);

  const {title,summary,content} = req.body;

  const {token} = req.cookies
    jwt.verify(token, secret, {}, async (err, info)=>{
        const postDoc = await Post.create({
            title,
            summary,
            content,
            cover:newPath,
            author: info.id,
          });
        if(err) throw err;
        res.json(postDoc)
    })
}

async function getAllPosts(req,res){
    const data =await Post.find().populate('author',['username'])
    res.json(data)
}
async function getSinglePost (req, res) {
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
}

module.exports = {registerUser, loginUser,profile, logout,post, getAllPosts, getSinglePost}