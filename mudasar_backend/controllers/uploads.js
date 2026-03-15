const upload = require("../middlewares/uploads")
var fs = require("fs"); // Load the filesystem module
const path = require("path")

const uploadFile = (req, res) => { // 3rd param of Request handler is next function, not error object
    try {
      
    
    
    var uploadSingle = upload.single('file');
    uploadSingle(req, res, (err) => { // call as a normal function
      //Send Error response
      if (err){
        console.log(err) 
        return res.status(500).send({ success: false, msg: 'Only image are allowed' })}
      const file = req.file;
      //Check if file is not exist then send error res.
      if (!file) {
        console.log("file not available")
        return res.status(500).send({ success: false, msg: "Please upload a file" });
      }
      //Send Success response for file upload with file name
      res.send({ msg: "file uploaded successfully", success: true, filename: path.basename(file.path) });
    })
  } catch (error) {
      console.log(error)
  }
  
  }

module.exports = uploadFile