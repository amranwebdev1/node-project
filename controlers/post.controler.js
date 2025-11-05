const Post = require('../models/post.model.js');
const User = require('../models/user.model.js');


const createPost = async (req,res)=>{
  const {caption} = req.body;
  const image = req.file?req.file.filename:""
  try{
    if(!req.id){
      return res.status(401).json({message:'Unauthorizad user'})
    }
    const newPost = new Post({
      user:req.id,
      caption,
      image
    })
    const userPost = await newPost.save()
    await User.findByIdAndUpdate(req.id,{$push:{post:userPost._id}})
    res.status(200).json({message:"post created successfully", post: userPost})
  }catch(err){
    res.status(500).json({error:err.message})
  }
}

//findAllPost

const findAllPost = async (req,res)=>{
  try{
    const allPost = await Post.find()
    .populate("user","name email profilePic")
    .populate("comments")
    .sort({createdAt:-1});
    console.log(allPost)
    res.status(200).json(allPost)
  }catch(err){
    res.status(500).json({message:err.message})
  }
}
//find user Post
const findUserPost = async (req,res)=>{
  try{
    const userPost = await Post.find({user:req.params.userId})
    .populate("user","name email profilePic")
    res.status(200).json(userPost)
    res.status(200).json(userPost)
  }catch(err){
    res.status(500).json({message:"user post not found"})
  }
}
//updatePost
const updatePost = async (req,res)=>{
  try{
    const postId = req.params.postId;
    const {caption} = req.body;
    const image = req.file? req.file.filename:undefined
    const post = await Post.findById(postId);
    if(!post) return res.status(404).json({message:"post not found"})
    if(post.user.toString() !== req.id){
      return res.status(402).json({message:"only woner"})
    }
    if(caption !== undefined){
      post.caption = caption
    }
    if(image !== undefined){
      post.image = image
    }
    const updatePost = await post.save()
    res.status(200).json({message:"poat updated",post:updatePost})
  }catch(err){
    res.status(500).json({message:"server error updating post"})
  }
}

//delete post
const postDelete = async (req,res)=>{
  try{
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if(!post) return res.status(404).json({message:"Post not found"})
    if(post.user.toString() !== req.id){
      return res.status(402).json({message:"only woner deleted"})
    }
    await Post.findByIdAndDelete(postId);
    // user id deleteOne
    await User.findByIdAndUpdate(req.id, { $pull: { post: postId} }, { new: true });
    
    res.status(200).json({message:"Post delete successfully"})
  }catch(err){
    res.status(500).json({message:"post not delete"})
  }
}
//like post
const postLike = async (req,res)=>{
  try{
    const postId = req.params.postId;
    const userId = req.id;
    const post = await Post.findById(postId)
    if(!post) return res.status(404).json({message:"post not found"})
    const index = post.likes.indexOf(userId);
    if(index === -1){
      post.likes.push(userId)
      await post.save()
      return res.status(200).json({message:"like added",likeCount:post.likes.length})
    }else{
      post.likes.splice(index,1)
      await post.save()
     return res.status(200).json({message:"like remove",likeCount:post.likes.length})
    }
  }catch(err){
    res.status(500).json({message:"post not like"})
  }
}
module.exports = {createPost,findAllPost,findUserPost,updatePost,postDelete,postLike}