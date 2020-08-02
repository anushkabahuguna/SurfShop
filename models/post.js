const mongoose						= require("mongoose");
const Schema						= mongoose.Schema;
const Review						= require("./review");
const mongoosePaginate				= require("mongoose-paginate");


const postSchema	=new Schema({
	title 			: String,
	price 			: String,
	description		: String,
	images			: [{
		url : String,
		public_id : String
	}],
	location		: String,
	coordinates		: Array,
	author			: {
						type: Schema.Types.ObjectId,
						ref : "User"
					},
	reviews			: [{
	
						type: Schema.Types.ObjectId,
						ref : "Review"
		
					}]
});

postSchema.pre("remove", async function(){
	await Review.remove({
		_id : {
			$in : this.reviews
		}
	});
});

	postSchema.plugin(mongoosePaginate);


module.exports		=mongoose.model("Post", postSchema);