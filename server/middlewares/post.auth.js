
module.exports = function(req, res, next){
    res.locals.error = "";
    res.locals.appName = String(process.env.APP_NAME).toUpperCase();
	res.locals.user = req.user
		? {
				name: req.user.name,
				email: req.user.email,
				authType: req.user.authType
		  }
		: {};
	next();
}