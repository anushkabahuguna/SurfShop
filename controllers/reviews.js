const Post		= require("../models/post");
const Review	= require("../models/review");


module.exports	= {
	
// Reviews Create
	async reviewCreate(req, res, next){
	
// // 	find the post by id
let post = await Post.findById(req.params.id).populate('reviews').exec();
		// filter post.reviews to see if any of the reviews were created by logged in user
		// .filter() returns a new array, so use .length to see if array is empty or not
		let haveReviewed = post.reviews.filter(review => {
			return review.author.equals(req.user._id);
		}).length;
		// check if haveReviewed is 0 (false) or 1 (true)
		if(haveReviewed) {
			// flash an error and redirect back to post
			req.session.error = 'Sorry, you can only create one review per post.';
			return res.redirect("/posts/" + post.id);
		}
		
//  create the review
	req.body.review.author = req.user._id;
	let review = await Review.create(req.body.review);
		
// 	assign review to post
	post.reviews.push(review);
		
// 	save the post
	post.save();
		
// 	redirect to the post
	req.session.success = "Successfully created a Review";
	res.redirect("/posts/" + post.id);	
		
	},

// 	Review Update
	async reviewUpdate(req, res, next){
		
		await Review.findByIdAndUpdate(req.params.review_id, req.body.review);
		req.session.success = "Review Updated Successfully";
		res.redirect("/posts/" + req.params.id);	
		
	},
	
// 	Review destroy
	async reviewDestroy(req, res, next){
	
// 	 first we remove the object id of the review from post and then
	await Post.findByIdAndUpdate(req.params.id, {
		$pull: {reviews : {$in : [req.params.review_id]}}
	});	
	
// 	delete the review from database
	await Review.findByIdAndRemove(req.params.review_id);
	req.session.success = "Review Deleted Successfully";
	res.redirect("/posts/" + req.params.id);	


	}
	
}
// why dont we need the other routes
// because our reviews are going to live on our post show page
// edit and new page will be on show page only we weill toggle it on/off respectively