const bcrypt = require("bcryptjs");
const cryptoRandomString = require("crypto-random-string");
const passport = require("passport");
const User = require("../models/users.model");
const sendPasswordResetEmail = require("./mailer.controller");
const { KnownError } = require("./errors.controller");

module.exports.signUp = async function (req, res, next) {
	try {
		const { email, password, name } = req.body;
		const hashedPassword = await bcrypt.hash(password, 10);
		await User.create({
			email,
			name,
			authType: "email",
			password: hashedPassword
		});
		res.json({
			ok: true
		});
	} catch (e) {
		if (e.code === 11000) {
			const message = `User with email "${email}" already exists`;
			const status = 401;
			next(new KnownError(message, status));
		} else {
			next(e);
		}
	}
};

module.exports.logIn = function (req, res, next) {
	passport.authenticate("local", (err, user, info) => {
		if (err) {
			next(err);
		} else if (!user) {
			next(new KnownError(info.message, 401));
		} else if (user) {
			req.logIn(user, async (err) => {
				if (!err) {
					const userToBeSentToFrontend = {
						name: user.name,
						email: user.email,
						authType: user.authType
					};
					if (req.body["remember-me"]) {
						const userFromDB = await User.findOne({
							email: user.email
						});
						userFromDB.rememberMeToken = cryptoRandomString(20);
						await userFromDB.save();
						res.cookie(
							process.env.REMEMBER_ME_COOKIE_NAME,
							userFromDB.rememberMeToken,
							{
								path: "/",
								httpOnly: true,
								maxAge: 7 * 24 * 60 * 60 * 1000
							}
						);
					}
					res.json({ ok: true, user: userToBeSentToFrontend });
				} else next(err);
			});
		}
	})(req, res, next);
};

module.exports.logOut = function (req, res, next) {
	try {
		req.logOut();
		res.clearCookie(process.env.COOKIE_NAME);
		res.clearCookie(process.env.REMEMBER_ME_COOKIE_NAME); // Clear cookie for remember-me as well
		res.json({ ok: true });
	} catch (e) {
		next(e);
	}
};

module.exports.changePassword = async function (req, res, next) {
	try {
		if (!req.user)
			throw new KnownError("You have to be signed in to do that", 401);
		if (req.user.authType !== "email")
			throw new KnownError(
				"Only email authenticated users can change their password",
				401
			);
		const user = await User.findOne({ email: req.user.email });
		const body = req.body;
		const isPasswordValid = await bcrypt.compare(
			body["old-password"],
			user.password
		);
		if (isPasswordValid) {
			const hashedPassword = await bcrypt.hash(body.password, 10);
			user.password = hashedPassword;
			await user.save();
			res.json({ ok: true });
		} else {
			throw new KnownError("Your old password is incorrect", 401);
		}
	} catch (e) {
		next(e);
	}
};

module.exports.resetPassword = async function (req, res, next) {
	try {
		const { email } = req.body;
		const user = await User.findOne({ email });
		if (!user)
			throw new KnownError(`Email "${email}" has not signed up yet`, 401);
		if (user.authType !== "email")
			throw new KnownError(
				"Only email authenticated users can reset their password",
				401
			);
		// TODO: Generate a complex unique token below
		const resetToken = `${user.id.toString()}:${Date.now()}`;
		user.resetToken = await bcrypt.hash(resetToken, 10);
		user.resetTokenTimestamp = Date.now();
		await user.save();
		// Send email to user below this line; route is /reset-password/:resetToken
		sendPasswordResetEmail(user, user.resetToken)
			.then(() => {
				res.json({ ok: true });
			})
			.catch(next);
	} catch (e) {
		next(e);
	}
};

module.exports.getChangePasswordAfterResetPage = async function (
	req,
	res,
	next
) {
	try {
		let { resetToken } = req.params;
		resetToken = decodeURIComponent(resetToken);
		if (!resetToken) return res.redirect("/");
		const user = await User.findOne({ resetToken });
		if (user) {
			const timeDiff = Date.now() - user.resetTokenTimestamp;
			// If Date.now is greater by 6 hours, throw error
			if (timeDiff > 6 * 60 * 60 * 1000)
				throw new KnownError("Your reset token has expired", 401);
			// Resets below ensure token can only be used once
			user.resetToken = null;
			user.resetTokenTimestamp = null;
			await user.save();
			req.session.email = user.email;
			res.locals.user.resetPassword = true;
			res.render("index");
		} else {
			throw new KnownError("Your reset token is invalid", 400);
		}
	} catch (e) {
		next(e);
	}
};

module.exports.changePasswordAfterReset = async function (req, res, next) {
	try {
		const email = req.session.email;
		if (!email)
			throw new KnownError(
				"Please go to homepage and reset password again",
				400
			);
		const user = await User.findOne({ email });
		const { password } = req.body;
		const hashedPassword = await bcrypt.hash(password, 10);
		user.password = hashedPassword;
		await user.save();
		res.json({ ok: true });
	} catch (e) {
		next(e);
	}
};
