const Post				= require("../models/post");
const mbxGeocoding  	= require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken	    = process.env.MAPBOX_TOKEN;
const geocodingClient   = mbxGeocoding({ accessToken: mapboxToken });
const cloudinary		= require("cloudinary");
cloudinary.config({
	cloud_name : "caracloud28",
	api_key	   : "888796778459759",
	api_secret : process.env.CLOUDINARY_SECRET
});

module.exports	= {
// 	post index
	async postIndex(req, res, next){
		
// 		change .find() to .paginate();
			let posts	= await Post.paginate({},{
				page : req.query.page || 1,
				limit : 10,
				sort : {
					"_id" : -1
				}
				// we can write this as sort : "-_id" also
				// sort by id = sort by date created
			});
		posts.page = Number(posts.page);
// 		here we change this value to number so we can use it in our template
			res.render("posts/index", {posts, title: "Index Page", mapboxToken});
// 		in es6 posts : posts can simply be written as posts
	},
// 	new post
	postNew(req,res, next){
		res.render("posts/new", {title: "New Post"});
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
		
// 		here we will convert our location into coordinates and 
		let response	=	await geocodingClient.forwardGeocode({
								  query: req.body.post.location,
								  limit: 1
								})
							 .send();
		
// 		assign it to our coordinates array in our new post
		req.body.post.geometry	=	response.body.features[0].geometry;
		
		// req.body to create a new post
		// let post=	await Post.create(req.body);
		// console.log(req.body);
// 		if we used only req.body also it would work becuase req.body only containe the data from post method
		
		let post = new Post(req.body.post);
// 		we had to have a post id for setting the next property so we didnt use post. create but used the constructor syntax
		post.properties.description = `<strong><a href="/posts/${post._id}">${post.title}</a></strong><p>${post.location}</p><p>${post.description.substring(0, 20)}...</p>`;
		await post.save();
		
		req.session.success = "Post created successfully";
		res.redirect("/posts/" + post.id);	
		// res.redirect(`/posts/${post.id}`);	

	},
	
	async postShow(req, res, next){
		let post = 
		await Post.findById(req.params.id).populate(
			{path : "reviews",
			 options : {sort : {"_id" : -1}
					   },
			 populate : {
				 path : "author",
				 model : "User"
			 }
			});
		const floorRating = post.calculateAvgRating();
		res.render("posts/show", {post, mapboxToken, floorRating});
	},
// 	edit 
	async postEdit(req, res, next){
		let post = await Post.findById(req.params.id);
		res.render("posts/edit", {post, title : "Edit Post"});
	},
// 	update
	async postUpdate(req, res, next){
		
// 		find the post by id
		let post	=	await Post.findById(req.params.id);
		
// 		check if there are any images for deletion
		if(req.body.deleteImages && req.body.deleteImages.length)
			{
// 				assign deleteImages from req.body to its own variable
				let deleteImages	=	req.body.deleteImages;
				
// 				loop over deleteImages( we use for of function for async await)
				for(const public_id of deleteImages)
				{
// 					delete images from cloudinary
					await cloudinary.v2.uploader.destroy(public_id);
					
// 					delete images from post.images
					for(const image of post.images){
						if(public_id === image.public_id){
							let index	=	post.images.indexOf(image);
							post.images.splice(index, 1);
						}
					}
				}
				
			}
// 	check if there are any new images to upload
		if(req.files)
		{
// 			upload images
			for(const file of req.files){
			let image = await cloudinary.v2.uploader.upload(file.path);
// 			add images to post.images array
			post.images.push({
				url : image.secure_url,
				public_id : image.public_id
			});
		  }
		}
		
// 	check if the post was updated with the location
	if(post.location !== req.body.post.location)
		{
			let response = await geocodingClient.forwardGeocode({
								query: req.body.post.location,
								limit: 1
							})
							.send();
			
			post.geometry	=	response.body.features[0].geometry;
			post.location		=	req.body.post.location;

		}
		
// 	update the post with any new properties
	
	post.title			=	req.body.post.title;
	post.description	=	req.body.post.description;
	post.price			=	req.body.post.price;
	post.properties.description = `<strong><a href="/posts/${post._id}">${post.title}</a></strong><p>${post.location}</p><p>${post.description.substring(0, 20)}...</p>`;
	
		
// 	save the updated post to db IMPORTANT STEP
	await post.save();
		
// 	redirect to show page
	res.redirect("/posts/" + post.id);
		
	},
// 	destroy
	async postDestroy(req, res, next){
		let post	=	await Post.findById(req.params.id);
		
// 		iterate over post.images to delete from cloudinary 
		for(const image of post.images){
			
			await cloudinary.v2.uploader.destroy(image.public_id);
			
		}
		await post.remove();
		req.session.success = "Post Deleted Successfully";
		res.redirect("/posts");
	}

}