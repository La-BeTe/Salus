const passport = require("passport");

const { KnownError } = require("./errors");

module.exports.redirectToProvider = function (req, res, next) {
	let callback;
	const provider = req.params.provider;

	switch(provider){
		case "google":
			callback = passport.authenticate("google", {
				scope: ["profile", "email"]
			});
			break;
		case "twitter":
		case "facebook":
			callback = passport.authenticate(provider);
			break;
	}

	if(typeof callback !== "function") return next(
		new KnownError("Invalid authentication method", 400)
	);
	return callback(req, res, next);
};


module.exports.handleProviderVerification = function (req, res, next) {
	const provider = req.params.provider;
	switch (provider) {
		case "google":
		case "twitter":
		case "facebook":
			return passport.authenticate(provider, (_err, user)=>{
				if(_err) return next(_err);
				//The "if" below should never happen, just here as a failsafe
				if(!user) return next(new KnownError("No user found"));
				req.logIn(user, (err) => {
					if(err) return next(err);
					res.redirect("/");
				});
			})(req, res, next);
		default:
			return next(new KnownError("Invalid authentication method", 400));
	}
};
