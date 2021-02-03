const router = require("express").Router();
const { errorHandler } = require("./controllers/errors.controller");
const validator = require("./controllers/validator.controller");
const {
	signUp,
	logIn,
	logOut,
	changePassword,
	getChangePasswordAfterResetPage,
	changePasswordAfterReset,
	resetPassword
} = require("./controllers/users.controller");
const {
	redirectToProvider,
	handleProviderVerification
} = require("./controllers/oauth.controller");

//OAuth login renders index.ejs with the user or error is passed in res.locals
router.get("/auth/:provider", redirectToProvider);
router.get("/auth/:provider/redirect", handleProviderVerification);

// Email signup and login returns data as res.json calls as frontend is an SPA
router.post(
	"/signup",
	validator("email", "password", "confirm-password", "name"),
	signUp
);
router.post("/login", validator("email", "password", "remember-me"), logIn);

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
router.get("*", (_, res, __) => res.redirect("/"));

// Error Handler
router.use(errorHandler);

module.exports = router;
