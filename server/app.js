require("dotenv").config();
const express = require("express");
const { resolve } = require("path");
const mongoose = require("mongoose");
const session = require("express-session");

const router = require("./router");
const setupAuth = require("./middlewares/auth.setup");
const preAuthSetup = require("./middlewares/pre.auth");
const postAuthSetup = require("./middlewares/post.auth");

const app = express();

// App Configuration
app.set("views", resolve(__dirname, "views"));
app.set("view engine", "ejs");
if(process.env.NODE_ENV !== "dev") app.set("trust proxy", 1);

// DB Connection Setup
mongoose.connect(process.env.MONGODB_URI, {
	useCreateIndex: true,
	useNewUrlParser: true,
	useFindAndModify: false,
	useUnifiedTopology: true,
});
mongoose.connection.once("open", () => console.log("Database started"));

// Express Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(resolve(__dirname, "..", "ui", "public")));
app.use(session({
	resave: false,
	rolling: true,
	saveUninitialized: false,
	name: process.env.COOKIE_NAME,
	secret: process.env.SESSION_SECRET,
	cookie: {
		maxAge: 30 * 60 * 1000,
		secure: process.env.NODE_ENV !== "dev"
	}
}));

app.use(preAuthSetup);

app.use(setupAuth(app));

app.use(postAuthSetup);

app.use(router);

app.listen(process.env.PORT, () => {
	console.log(`Server started, listening on PORT ${process.env.PORT}`);
});
