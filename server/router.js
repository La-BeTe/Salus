const router = require("express").Router();

const validator = require("./middlewares/validator");
const { errorHandler } = require("./controllers/errors");
const {
	logIn,
	logOut,
	signUp,
	resetPassword,
	changePassword,
	changePasswordAfterReset,
	getChangePasswordAfterResetPage,
} = require("./controllers/users");
const {
	redirectToProvider,
	handleProviderVerification
} = require("./controllers/oauth");

//OAuth login renders index.ejs with the user or error is passed in res.locals
router.get("/auth/:provider", redirectToProvider);
router.get("/auth/:provider/redirect", handleProviderVerification);

// Email signup and login returns data as res.json calls as frontend is an SPA
router.post(
	"/signup",
	validator("name", "email", "password", "confirm-password"),
	signUp
);
router.post("/login", validator("email", "password"), logIn);

// Logout route handles both oauth and email authenticated users
router.get("/logout", logOut);

// Change password route, only for email authenticated users
router.post(
	"/change-password",
	validator("password", "old-password", "confirm-password"),
	changePassword
);

// Reset password routes
router.get("/reset-password/:resetToken", getChangePasswordAfterResetPage);
router.post(
	"/reset-change-password",
	validator("password", "confirm-password"),
	changePasswordAfterReset
);
router.post("/reset-password", validator("email"), resetPassword);

// Index page route
router.get("/", (_, res) => res.render("index"));

// Catch all other GET requests and redirect to /
router.get("*", (_, res) => res.redirect("/"));

// Error Handler
router.use(errorHandler);

module.exports = router;
