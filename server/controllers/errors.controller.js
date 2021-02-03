class KnownError extends Error {
	constructor(message, status = 500) {
		if (!message)
			throw new Error("The class KnownError requires a message argument");
		super(message);
		this.status = status;
	}
}

function errorHandler(err, req, res, __) {
	console.log(err instanceof KnownError ? err.message : err);
	res.status(err.status || 500);
	const error =
		err instanceof KnownError ? err.message : "Server error occurred";
	if (req.accepts("html")) {
		res.locals.error = error;
		res.render("index");
	} else if (req.accepts("json")) {
		res.json({
			ok: false,
			error
		});
	}
}

module.exports = { errorHandler, KnownError };
