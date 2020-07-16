const mongoose						=require("mongoose");
const passportLocalMongoose			=require("passport-local-mongoose");
const Schema						=mongoose.Schema;


const userSchema	=new Schema({
	email	 : String,
	// password : String,
	// username : String, we dont put thses as passport local mongoose handles the password by hashing and 
	// putting a salt value and puts it in our user object
	image	 : String,
	posts	 : [
		{
			// note we are not embeding a object but poplulating it be connecting to an id	
			type: Schema.Types.ObjectId,
			ref : "Post"
		}
	]
});

userSchema.plugin(passportLocalMongoose);

module.exports		=mongoose.model("User", userSchema);