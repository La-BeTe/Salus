const express = require("express");
const session = require("express-session");
// Using cookie library because passport-remember-me strategy requires req.cookies
// and I'm not using cookieParser because expressSession can parse cookies but
// does not place them in req.cookies
const cookie = require("cookie");
const passport = require("passport");
const mongoose = require("mongoose");
const { resolve } = require("path");
require("dotenv").config();
const User = require("./models/users.model");
const router = require("./router");
const {
	GoogleStrategy,
	RememberMeStrategy,
	FBStrategy,
	LocalStrategy,
	TwitterStrategy
} = require("./strategies");

const app = express();

// App Configuration
app.set("views", resolve(__dirname, "views"));
app.set("view engine", "ejs");

// DB Connection Setup
mongoose.connect(process.env.MONGODB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: false
});
mongoose.connection.once("open", () => console.log("Database started"));

// Express Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(resolve(__dirname, "..", "ui", "public")));
app.use(
	session({
		name: process.env.COOKIE_NAME,
		cookie: {
			maxAge: 30 * 60 * 1000,
			secure: process.env.NODE_ENV === "production"
		},
		rolling: true,
		saveUninitialized: false,
		resave: false,
		secret: process.env.SESSION_SECRET
	})
);
app.use((req, _, next) => {
	req.cookies = cookie.parse(req.headers.cookie || "");
	next();
});
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate("remember-me"));

// Passport Middlewares
passport.serializeUser((user, done) => {
	done(null, String(user._id));
});
passport.deserializeUser(async (id, done) => {
	try {
		const user = await User.findById(id);
		done(null, user);
	} catch (e) {
		done(e);
	}
});
passport.use(GoogleStrategy());
passport.use(RememberMeStrategy());
passport.use(TwitterStrategy());
passport.use(FBStrategy());
passport.use(LocalStrategy());

app.use((req, res, next) => {
	res.locals.user = req.user
		? {
				name: req.user.name,
				email: req.user.email,
				authType: req.user.authType
		  }
		: {};
	res.locals.error = "";
	next();
});

app.use(router);

app.listen(process.env.PORT, () => {
	console.log(`Server started, listening on PORT ${process.env.PORT}`);
});
