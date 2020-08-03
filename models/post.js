const mongoose						= require("mongoose");
const Schema						= mongoose.Schema;
const Review						= require("./review");
const mongoosePaginate				= require("mongoose-paginate");

// we are converting it to a geo json data for cluster maps

const postSchema	=new Schema({
	title 			: String,
	price 			: String,
	description		: String,
	images			: [{
		url : String,
		public_id : String
	}],
	location		: String,
	geometry		: {
				
						type : {
							type : String,
							enum : ["Point"],
							required : true
						},
		
						coordinates : {
							type : [Number],
							required : true
						}
		
					  },
	properties		: {
						description : String
					},
	author			: {
						type: Schema.Types.ObjectId,
						ref : "User"
					},
	reviews			: [{
	
						type: Schema.Types.ObjectId,
						ref : "Review"
		
					}],
	avgRating      : {
		type : Number,
		default : 0
	}
});

postSchema.pre("remove", async function(){
	await Review.remove({
		_id : {
			$in : this.reviews
		}
	});
});
// cant use arrow function here as we have to use "this"
postSchema.methods.calculateAvgRating = function(){
	
	let ratingsTotal = 0;
	
// 	run the code only if reviews exist
	if(this.reviews.length){
		this.reviews.forEach(review =>{
		ratingsTotal+=review.rating;
		});
// 		rounding to two digits
	
	this.avgRating = Math.round((ratingsTotal/this.reviews.length)*10)/10;
	
	}
	else{
		this.avgRating =ratingsTotal;
	}
	const floorRating = Math.floor(this.avgRating);
	this.save();
	
	return floorRating;
}





	postSchema.plugin(mongoosePaginate);


module.exports		=mongoose.model("Post", postSchema);