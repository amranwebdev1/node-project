//comment router
const express = require('express')
const checkLogin = require('../middleware/chackLogin.js')
const {createComment,commentFind} = require('../controlers/comment.controler.js')
const router = express.Router();
// create comment
router.post('/create/:postId',checkLogin,createComment)
//comment show
router.get('/find/:postId',commentFind)
module.exports = router;