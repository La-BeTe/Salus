const bcrypt = require("bcryptjs");
const passport = require("passport");
const FBStrategy = require("passport-facebook").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const TwitterStrategy = require("passport-twitter").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const RememberMeStrategy = require("passport-remember-me").Strategy;

const User = require("../models/users");
const { generateRandomString } = require("../utils")

function verifyOAuth(authType){
	return async function(_, __, profile, done){
		try{
			const user = await User.findOne({
				authType,
				oAuthId: profile.id
			});
			if(user) return done(null, user);
			const newUser = await User.create({
				authType,
				oAuthId: profile.id,
				name: profile.displayName,
				email: `${profile.id}@${authType}.com`
			});
			return done(null, newUser);
		}catch(err){
			done(err);
		}
	}
}

function setupGoogleStrategy(){
	return new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: `${process.env.SITE_URL}/auth/google/redirect`
		},
		verifyOAuth("google")
	);
};

function setupTwitterStrategy(){
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
		verifyOAuth("twitter")
	);
};

function setupFBStrategy(){
	return new FBStrategy(
		{
			clientID: process.env.FB_APP_ID,
			clientSecret: process.env.FB_APP_SECRET,
			callbackURL: `${process.env.SITE_URL}/auth/facebook/redirect`,
			profileFields: ["id", "displayName", "email"]
		},
		verifyOAuth("facebook")
	);
};

function setupLocalStrategy(){
	return new LocalStrategy(
		{ usernameField: "email" },
		async function(email, password, done){
			try{
				const user = await User.findOne({ email });
				if(!user){
					return done(null, null, {
						message: `Email "${email}" is yet to sign up`,
					});
				}
				if(user.authType !== "email"){
					return done(null, null, {
						message: `Email "${email}" already signed up with ${user.authType}`
					});
				}
				const isPasswordValid = await bcrypt.compare(
					password,
					user.password
				);
				if(!isPasswordValid){
					return done(null, null, {
						message: "Invalid email-password combination"
					});
				}
				return done(null, user);
			}catch(err){
				done(err);
			}
		}
	);
};

function setupRememberMeStrategy(){
	return new RememberMeStrategy(
		{ key: process.env.REMEMBER_ME_COOKIE_NAME },
		async function(token, done){
			try{
				const user = await User.findOne({ rememberMeToken: token });
				if(!user) return done(null, null, {
					message: "Invalid token passed. Please re-login"
				});
				return done(null, user);
			}catch(err){
				done(err);
			}
		},
		async function(user, done){
			try{
				const rememberMeToken = generateRandomString(process.env.REMEMBER_ME_COOKIE_LENGTH);
				await User.findOneAndUpdate(
					{ email: user.email },
					{ rememberMeToken }
				);
				return done(null, rememberMeToken);
			}catch(err){
				done(err);
			}
		}
	);
};

module.exports = function(expressApp){
	expressApp.use(passport.initialize());
	expressApp.use(passport.session());
	expressApp.use(passport.authenticate("remember-me"));
	passport.serializeUser((user, done) => {
		done(null, String(user._id));
	});
	passport.deserializeUser(async (id, done) => {
		try{
			const user = await User.findById(id);
			done(null, user);
		}catch(err){
			done(err);
		}
	});
	passport.use(setupFBStrategy());
	passport.use(setupLocalStrategy());
	passport.use(setupGoogleStrategy());
	passport.use(setupTwitterStrategy());
	passport.use(setupRememberMeStrategy());

	return function(_, __, next){
		expressApp.use(passport.initialize());
		expressApp.use(passport.session());
		expressApp.use(passport.authenticate("remember-me"));
		next();
	}
}
