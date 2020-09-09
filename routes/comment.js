
var express=require("express");
var router=express.Router();

var car=require("../models/cars");
var Comment=require("../models/comment")
//=============
// COMMENTS
//=============
router.get("/cars/:id/comments/new",isLoggedIn,function(req,res){
			 //FIND GROUND BY ID
			 car.findById(req.params.id,function(err,car){
			 	if(err){
			 		console.log(err);
			 	}else{
			 		res.render("comments/new",{cars:car});
			 	}
			 	});
}); 

//post the comments
router.post("/cars/:id/comments",isLoggedIn,function(req,res){
			 //FIND GROUND BY ID
			 car.findById(req.params.id,function(err,car){
			 	if(err){
			 		console.log(err);
			 		res.redirect("/cars");
			 	}else{
			 		//create a comment
			 		Comment.create(req.body.comment,function(err,comment){
			 			if(err){
			 				console.log(err);
			 			}else{
			 				comment.author.id=req.user._id;
			 				comment.author.username=req.user.username;
			 				//save comment
			 				comment.save();
			 				 car.comments.push(comment);
			 				 car.save();
			 				 req.flash("sucess","Successfully added comment");
			 				 res.redirect("/cars/"+ car._id);
			 			}
			 		})
			 		//connect comment to car

			 		//redirect car show page

			 	}
			 	});
});


//EDIT COMMENT

router.get("/cars/:id/comments/:comment_id/edit",checkCommentOwner,function(req,res){
	Comment.findById(req.params.comment_id,function(err,foundComment){
		if(err){
			res.redirect("back");
		}else{
			res.render("comments/edit",{cars_id: req.params.id,comment: foundComment});			
		}
	});
})


//COMMENTS UPDATE

router.put("/cars/:id/comments/:comment_id",checkCommentOwner,function(req,res){
		Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
			if(err){
				res.redirect('back');
			}else{
				res.redirect("/cars/" + req.params.id);

			}
		})
})

//DELETE
router.delete("/cars/:id/comments/:comment_id",checkCommentOwner,function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
		if(err){
			res.redirect("back");
		}else{
			req.flash("success","Comment deleted!")
			res.redirect("/cars/" + req.params.id);  
		}
		
	})
})


// ============
// midddleware
// ============
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","Please Login First!");
	res.redirect("/login")
}


module.exports=router;


function checkCommentOwner(req,res,next){
 		if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id,function(err,foundComment){
			if(err){
				res.redirect("back");
			}else{
				if(foundComment.author.id.equals(req.user._id)){
					next();
				}else{
					res.redirect("back");
				}
			}
		});
	}else{	
		res.redirect("back");
	}
}
