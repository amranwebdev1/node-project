// comment controller
const Post = require('../models/post.model.js')
const Comment = require('../models/comment.model.js')
const createComment = async (req,res)=>{
  try{
    const {text} = req.body;
    const postId = req.params.postId;
    const userId = req.id;
    if(!text) return res.status(400).json({message:"Text is required"});
    const post = await Post.findById(postId);
    if(!post)return res.status(404).json({message:"Post not found"});
    const newComment = new Comment({
      post:postId,
      user:userId,
      text
    })
    await newComment.save()
    post.comments.push(newComment._id);
    await post.save()
    
    res.status(200).json({message:"Comment Created successfully"})
  }catch(err){
    res.status(500).json({message:err.message})
  }
}

//comment findBy
const commentFind = async (req,res)=>{
  try{
    const postId = req.params.postId;
   const comment =  await Comment.find({post:postId})
    .populate("user","name profilePic")
    .sort({createdAt:-1})
    res.json(comment)
  }catch(err){
    res.status(500).json({message:err.message})
  }
}
module.exports = {createComment,commentFind}