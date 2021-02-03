const passport = require("passport");
const { KnownError } = require("./errors.controller");

module.exports.redirectToProvider = function (req, res, next) {
	const provider = req.params.provider;
	(function () {
		switch (provider) {
			case "google":
				return passport.authenticate("google", {
					scope: ["profile", "email"]
				});
			case "facebook":
				return passport.authenticate("facebook");
			case "twitter":
				return passport.authenticate("twitter");
			default:
				return next(
					new KnownError("Invalid authentication method", 400)
				);
		}
	})()(req, res, next);
};

module.exports.handleProviderVerification = function (req, res, next) {
	const provider = req.params.provider;
	function handleUserVerification(err, user, _) {
		if (err) next(err);
		else if (!user) next(new KnownError("No user found"));
		//The above "else if" should never happen, just here as a failsafe
		else if (user) {
			req.logIn(user, (err) => {
				if (!err) {
					res.redirect("/");
				} else next(err);
			});
		}
	}
	switch (provider) {
		case "google":
		case "facebook":
		case "twitter":
			return passport.authenticate(provider, handleUserVerification)(
				req,
				res,
				next
			);
		default:
			return next(new KnownError("Invalid authentication method", 400));
	}
};
