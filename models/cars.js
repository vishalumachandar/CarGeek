
var mongoose = require("mongoose");

var carSchema = new mongoose.Schema({
   name: String,
   price:String,
   url: String,
   description: String,
   author:{
   	id:{
   		type: mongoose.Schema.Types.ObjectId,
   		ref: "User"
   	},
      username:String,
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});
module.exports=mongoose.model("Car",carSchema);