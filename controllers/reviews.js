const Post		= require("../models/post");
const Review	= require("../models/review");


module.exports	= {
	
// Reviews Create
	async reviewCreate(req, res, next){
		

	},

// 	Review Update
	async reviewUpdate(req, res, next){
		
	},
	
// 	Review destroy
	async reviewDestroy(req, res, next){
	
	}
	
}
// why dont we need the other routes
// because our reviews are going to live on our post show page
// edit and new page will be on show page only we weill toggle it on/off respectively