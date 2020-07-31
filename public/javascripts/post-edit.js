// 	listen for submittion of the form
	let postEditForm	=	document.getElementById("postEditForm");
	
// 	add a submit listener to it
postEditForm.addEventListener("submit", function(event){

	// 	find length of uploaded images
		let images	=	document.getElementById("imageUpload");
		let imageUploads   = 	images.files.length;

	// 	find total number of existing images
		let existingImgs	=	document.querySelectorAll(".imageDeleteCheckox").length;

	// 	find total number of potential deletions
		let imgDeletion		= 	document.querySelectorAll(".imageDeleteCheckox:checked").length;
	
	//  figure out if the form can be submgit itted 
	let newTotal	=	existingImgs - imgDeletion + imageUploads
		if(newTotal > 4)
			{
				event.preventDefault();
				let removalAmt	=	newTotal-4
				if(removalAmt == 1)
					{
						alert(`you need to remove atleast ${removalAmt} more image!`);
					}
				else{
					alert(`you need to remove atleast ${removalAmt} more images!`);
				}
			}

});
	