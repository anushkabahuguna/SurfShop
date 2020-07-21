// creating a middleware to catch promise/async errors (All)
// error handler takes async function as argument
module.exports	= {
	asyncErrorHandler	: (fn)=>
		(req, res, next) =>{
// 			this returns a thenable promise ( a promise that can use .then)
			Promise.resolve(fn(req, res, next))
			.catch(next);
// 			views>errors page is rendered
// 			we have a error handler function defined for above rendering
// 			this is the default handler that comes with app.js
		}
	
}