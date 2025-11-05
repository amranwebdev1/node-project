const express = require('express');
const {createPost,findAllPost,findUserPost,updatePost,postDelete,postLike} = require('../controlers/post.controler.js');
const checkLogin = require('../middleware/chackLogin.js')
const upload = require('../middleware/upload.js')
const router = express.Router();
router.post('/createPost',checkLogin,upload.single('image'),createPost);
//findAllPost
router.get('/allPost',findAllPost)
//findOneUserPost
router.get('/userPost/:userId',findUserPost)
//updatePost
router.put('/updatePost/:postId',checkLogin,upload.single('image'),updatePost)
//deletePost
router.delete('/postDelete/:postId',checkLogin,postDelete)
//like
router.post('/postLike/:postId',checkLogin,postLike)
module.exports = router;