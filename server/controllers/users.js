const bcrypt = require("bcryptjs");
const passport = require("passport");

const User = require("../models/users");
const { KnownError } = require("./errors");
const { 
	sendEmail,
	generateRandomString,
	generatePasswordResetEmail,
} = require("../utils");

module.exports.signUp = async function (req, res, next) {
	const { email, password, name } = req.body;
	try{
		const hashedPassword = await bcrypt.hash(password, 10);
		await User.create({
			name,
			email,
			authType: "email",
			password: hashedPassword
		});
		res.json({ ok: true });
	}catch(err){
		if(err.code === 11000){
			const status = 401;
			const message = `User with email "${email}" already exists`;
			next(new KnownError(message, status));
		}else{
			next(err);
		}
	}
};

module.exports.logIn = function(req, res, next){
	return passport.authenticate("local", (_err, user, info) => {
		if(_err) return next(_err);
		if(!user) return next(new KnownError(info.message, 401));
		if(user){
			req.logIn(user, async (err) => {
				if(err) return next(err);
				const userToBeSentToFrontend = {
					name: user.name,
					email: user.email,
					authType: user.authType
				};
				if(req.body["remember-me"]){
					const userFromDB = await User.findOne({ email: user.email });
					userFromDB.rememberMeToken = generateRandomString(process.env.REMEMBER_ME_COOKIE_LENGTH);
					await userFromDB.save();
					res.cookie(
						process.env.REMEMBER_ME_COOKIE_NAME,
						userFromDB.rememberMeToken,
						{
							path: "/",
							httpOnly: true,
							maxAge: (Number(process.env.REMEMBER_ME_COOKIE_EXPIRY) || 7) * 24 * 60 * 60 * 1000
						}
					);
				}
				res.json({ ok: true, user: userToBeSentToFrontend });
			});
		}
	})(req, res, next);
}

module.exports.logOut = function (req, res, next) {
	try{
		req.logOut();
		res.clearCookie(process.env.COOKIE_NAME);
		// Clear cookie for remember-me as well
		res.clearCookie(process.env.REMEMBER_ME_COOKIE_NAME);
		res.json({ ok: true });
	}catch(e){
		next(e);
	}
};

module.exports.changePassword = async function (req, res, next) {
	try{
		if(!req.user)
			throw new KnownError("You have to be signed in to do that", 401);
		if(req.user.authType !== "email")
			throw new KnownError(
				"Only email authenticated users can change their password",
				401
			);

		const user = await User.findOne({ email: req.user.email });
		const isPasswordValid = await bcrypt.compare(
			req.body["old-password"],
			user.password
		);
		if(!isPasswordValid)
			throw new KnownError("Your old password is incorrect", 401);
		if(req.body.password === req.body["old-password"])
			throw new KnownError("Your old and new password cannot be thesame", 400)

		const hashedPassword = await bcrypt.hash(req.body.password, 10);
		user.password = hashedPassword;
		await user.save();
		res.json({ ok: true });
	}catch(err){
		next(err);
	}
};

module.exports.resetPassword = async function (req, res, next) {
	try{
		const { email } = req.body;
		const user = await User.findOne({ email });
		if(!user)
			throw new KnownError(`Email "${email}" has not signed up yet`, 401);
		if(user.authType !== "email")
			throw new KnownError(
				"Only email authenticated users can reset their password",
				401
			);
		
		user.resetToken = generateRandomString(process.env.RESET_TOKEN_LENGTH || 40);
		user.resetTokenExpiry = Date.now() + ((Number(process.env.RESET_TOKEN_EXPIRY) || 6) * 60 * 60 * 1000);
		await user.save();

		// Send email to user below this line; route is /reset-password/:resetToken
		const [emailHtml, emailText] = generatePasswordResetEmail(user);
		await sendEmail(user.email, "Password Reset.", emailHtml, emailText);
		res.json({ ok: true });
	}catch(err){
		next(err);
	}
};

module.exports.getChangePasswordAfterResetPage = async function(req, res, next){
	try{
		const resetToken = decodeURIComponent(req.params.resetToken);
		if(!resetToken) return res.redirect("/");

		const user = await User.findOne({ resetToken });
		if(!user)
			throw new KnownError("Your reset token is invalid", 400);
		if(Date.now() > user.resetTokenExpiry)
			throw new KnownError("Your reset token has expired", 401);

		// Reset below ensures token can only be used once
		user.resetTokenExpiry = Date.now();
		await user.save();
		req.session.email = user.email;
		res.locals.user.resetPassword = true;
		res.render("index");
	}catch(err){
		next(err);
	}
};

module.exports.changePasswordAfterReset = async function(req, res, next){
	try{
		if(!req.session.email)
			throw new KnownError(
				"Please go to homepage and reset password again",
				400
			);
		
		const user = await User.findOne({ email: req.session.email });
		user.password = await bcrypt.hash(req.body.password, 10);
		await user.save();
		res.json({ ok: true });
	}catch(err){
		next(err);
	}
};
