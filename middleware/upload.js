const multer = require("multer")
const path = require("path")
const storage = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,"upload/")
  },
  filename:(req,file,cb)=>{
    const uniqeName = Date.now()+path.extname(file.originalname)
    cb(null,uniqeName)
  }
})
const fileFillter = (req,file,cb)=>{
  const allowedTypes = /jpg|jpeg|png/;
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  const mimeType = allowedTypes.test(file.mimetype)
  if(extName && mimeType) cb(null,true);
  else{
    cb(new error("Only image file allowed"))
  }
}
  const upload = multer({storage,fileFillter})
module.exports = upload;