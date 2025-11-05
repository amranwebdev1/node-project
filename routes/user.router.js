const express = require('express')
const {register,updateProfile,login,protectedRouter,userProfile,singleUser} = require("../controlers/user.controler.js")
const upload = require('../middleware/upload.js')
const checkLogin = require('../middleware/chackLogin.js')
const router = express.Router();
router.post('/register',register)
router.put('/update/:id',upload.fields([
  {name:"profilePic",maxCount:1},
  {name:"coverPic",maxCount:1}
  ]),updateProfile)

router.post('/login',login)

//protected router
router.get('/pro',checkLogin,protectedRouter)
//user profile
router.get('/profile/:userId',checkLogin,userProfile)
//singal user
router.get('/singleUser/:userId',singleUser)
module.exports = router;