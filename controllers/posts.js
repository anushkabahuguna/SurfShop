const Post			= require("../models/post");
const cloudinary	= require("cloudinary");
cloudinary.config({
	cloud_name : "caracloud28",
	api_key	   : "888796778459759",
	api_secret : process.env.CLOUDINARY_SECRET
});

module.exports	= {
// 	post index
	async postIndex(req, res, next){
		
			let posts	= await Post.find({});
			res.render("posts/index", {posts});
// 		in es6 posts : posts can simply be written as posts
	},
// 	new post
	postNew(req,res, next){
		res.render("posts/new");
	},
	async postCreate(req, res, next){
		req.body.post.images = [];
// 		cloudinary image
		for(const file of req.files){
			let image = await cloudinary.v2.uploader.upload(file.path);
			req.body.post.images.push({
				url : image.secure_url,
				public_id : image.public_id
			});
		}
		
		// req.body to create a new post
		// let post=	await Post.create(req.body);
		// console.log(req.body);
// 		if we used only req.body also it would work becuase req.body only containe the data from post method
			let post=	await Post.create(req.body.post);
		res.redirect("/posts/" + post.id);	
		// res.redirect(`/posts/${post.id}`);	

	},
	
	async postShow(req, res, next){
		let post = await Post.findById(req.params.id);
		res.render("posts/show", {post});
	},
// 	edit 
	async postEdit(req, res, next){
		let post = await Post.findById(req.params.id);
		res.render("posts/edit", {post});
	},
// 	update
	async postUpdate(req, res, next){
// 		handle deletion of images
// 		handle updation of images (make sure the maximum size is four)
		await Post.findByIdAndUpdate(req.params.id, req.body.post);
		res.redirect("/posts/" + req.params.id);
	},
// 	destroy
	async postDestroy(req, res, next){
		await Post.findByIdAndRemove(req.params.id);
		res.redirect("/posts");
	}

}