
var express=require("express");
var router=express.Router();

var car=require("../models/cars");
var Comment=require("../models/comment");
//create new camp
router.get("/cars/new",isLoggedIn,function(req,res){
	res.render("cars/new");
});

//display after post
router.post("/cars",isLoggedIn,function(req,res){
	var name=req.body.name;
	var url=req.body.url;
	var price=req.body.price;
	var description=req.body.description;
	var author={
		id:req.user._id,
		username:req.user.username,
	}
	var newcar={name: name,url: url,description:description, author:author,price:price};

		//create a new car and save to db
	car.create(newcar,function(err,newlycreated){
		if(err){
			console.log(err);
		}else{
			res.redirect("/cars");		
		}
	});
});
//display camp
router.get("/cars",function(req,res){
	//get all car from db
	car.find({},function(err,cars){
		if(err){
			console.log(err);
 		}
 		else{
 			res.render("cars/index",{cars: cars,currentUser: req.user});
 		}
	});
});
//display camp resp to id-SHOW
router.get("/cars/:id",function(req,res){
	car.findById(req.params.id).populate('comments').exec(function(err, foundCar){
		if(err){
			console.log(err);
		}else{
			 res.render("cars/show",{cars: foundCar});
		}
	});
});

//EDIT CG
router.get("/cars/:id/edit",checkCarOwner,function(req,res){
		car.findById(req.params.id,function(err,foundCar){
		res.render("cars/edit",{cars: foundCar});
	
});
});


//UPDATE CG
router.put("/cars/:id",checkCarOwner,function(req,res){
	//find n update the car
	car.findByIdAndUpdate(req.params.id,req.body.car,function(err,updatedCar){
		if(err){
			res.redirect("/cars");
		}else
		{
			res.redirect("/cars/" + req.params.id)
		}
	})
	//redirect somewhere
})

//DESTROY CG
router.delete("/cars/:id",checkCarOwner,function(req,res){
	car.findByIdAndDelete(req.params.id,function(err){

		if(err){
			res.redirect("/cars");
		}else{
			req.flash("success","car deleted!")
			res.redirect("/cars");
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
	req.flash("error","You need to be logged in to do that!");
	res.redirect("/login")
}


 function checkCarOwner(req,res,next){
 		if(req.isAuthenticated()){
		car.findById(req.params.id,function(err,foundcar){
			if(err){
				req.flash("error","You need to be logged in to do that!");
				res.redirect("/cars");
			}else{
				if(foundcar.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error","You need to have permission to do that!");
					res.redirect("back");
				}
			}
		});
	}else{
		req.flash("error","Please Login!");	
		res.redirect("back");
	}
}


module.exports=router;