// Using cookie library because passport-remember-me strategy requires req.cookies
// and I'm not using cookieParser because expressSession can parse cookies but
// does not place them in req.cookies
const cookie = require("cookie");

module.exports = function (req, _, next){
	req.cookies = cookie.parse(req.headers.cookie || "");
	next();
}