class KnownError extends Error{
	constructor(message, status) {
		message = String(message);
		if(!message.endsWith(".")) message += ".";
		super(message);
		this.status = Number(status) || 500;
	}
}

function errorHandler(err, req, res, __){
	let error = err.message;
	if(err instanceof KnownError && process.env.LOG_KNOWN_ERRORS){
		console.log(err.message)
	}
	if(!(err instanceof KnownError)){
		console.log(err);
		error = "Server error occurred";
	}

	res.status(err.status || 500);
	if(req.accepts("html")){
		res.locals.error = error;
		res.render("index");
	}else if(req.accepts("json")){
		res.json({ ok: false, error });
	}
}

module.exports = { errorHandler, KnownError };
