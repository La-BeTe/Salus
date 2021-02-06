const User = require("./models/users.model");
const bcrypt = require("bcryptjs");
const cryptoRandomString = require("crypto-random-string");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const RememberMeStrategy = require("passport-remember-me").Strategy;
const TwitterStrategy = require("passport-twitter").Strategy;
const FBStrategy = require("passport-facebook").Strategy;
const LocalStrategy = require("passport-local").Strategy;

module.exports.GoogleStrategy = () => {
	return new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: `${process.env.SITE_URL}/auth/google/redirect`
		},
		async function (accessToken, refreshToken, profile, done) {
			try {
				const user = await User.findOne({
					authType: "google",
					oAuthId: profile.id
				});
				if (!user) {
					const newUser = await User.create({
						authType: "google",
						oAuthId: profile.id,
						name: profile.displayName,
						email: profile.emails[0].value
					});
					return done(null, newUser);
				} else {
					return done(null, user);
				}
			} catch (e) {
				console.log(e);
				done(e);
			}
		}
	);
};

module.exports.TwitterStrategy = () => {
	// callbackURL replaces localhost in SITE_URL with 127.0.0.1
	// because twitter doesn't work with localhost
	return new TwitterStrategy(
		{
			consumerKey: process.env.TWITTER_KEY,
			consumerSecret: process.env.TWITTER_SECRET,
			callbackURL: `${process.env.SITE_URL.replace(
				"localhost",
				"127.0.0.1"
			)}/auth/twitter/redirect`
		},
		async function (accessToken, refreshToken, profile, done) {
			try {
				const user = await User.findOne({
					authType: "twitter",
					oAuthId: profile.id
				});
				if (!user) {
					const newUser = await User.create({
						authType: "twitter",
						oAuthId: profile.id,
						name: profile.displayName,
						// Temp email because collecting email from twitter requires
						// extra setup and user model must have unique emails
						email: `${profile.id}@twitter.com`
					});
					return done(null, newUser);
				} else {
					return done(null, user);
				}
			} catch (e) {
				console.log(e);
				done(e);
			}
		}
	);
};

module.exports.FBStrategy = () => {
	return new FBStrategy(
		{
			clientID: process.env.FB_APP_ID,
			clientSecret: process.env.FB_APP_SECRET,
			callbackURL: `${process.env.SITE_URL}/auth/facebook/redirect`,
			profileFields: ["id", "displayName", "email"]
		},
		async function (accessToken, refreshToken, profile, done) {
			try {
				const user = await User.findOne({
					authType: "facebook",
					oAuthId: profile.id
				});
				if (!user) {
					const newUser = await User.create({
						authType: "facebook",
						oAuthId: profile.id,
						name: profile.displayName,
						email: profile.email
					});
					return done(null, newUser);
				} else {
					return done(null, user);
				}
			} catch (e) {
				console.log(e);
				done(e);
			}
		}
	);
};

module.exports.LocalStrategy = () => {
	return new LocalStrategy(
		{
			usernameField: "email"
		},
		async function (email, password, done) {
			try {
				const user = await User.findOne({ email });
				if (!user)
					done(null, false, {
						message: `Email "${email}" is yet to sign up`
					});
				else {
					if (user.authType !== "email")
						return done(null, false, {
							message: `Email "${email}" already signed up with ${user.authType}`
						});
					const isPasswordValid = await bcrypt.compare(
						password,
						user.password
					);
					if (isPasswordValid) done(null, user);
					else
						done(null, false, {
							message: "Your password is incorrect"
						});
				}
			} catch (e) {
				done(e);
			}
		}
	);
};

module.exports.RememberMeStrategy = function () {
	return new RememberMeStrategy(
		{ key: process.env.REMEMBER_ME_COOKIE_NAME },
		async function (token, done) {
			try {
				const user = await User.findOne({ rememberMeToken: token });
				if (!user) return done(null, false);
				return done(null, user);
			} catch (e) {
				done(e);
			}
		},
		async function (user, done) {
			try {
				const rememberMeToken = cryptoRandomString(20);
				await User.findOneAndUpdate(
					{ email: user.email },
					{ rememberMeToken }
				);
				return done(null, rememberMeToken);
			} catch (e) {
				done(e);
			}
		}
	);
};
