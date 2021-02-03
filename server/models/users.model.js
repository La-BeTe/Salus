const { Schema, model } = require("mongoose");

const userSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		unique: true
	},
	authType: {
		type: String,
		default: "email"
	},
	password: {
		type: String
	},
	resetToken: {
		type: String,
		default: null
	},
	resetTokenTimestamp: {
		type: String,
		default: null
	},
	rememberMeToken: {
		type: String,
		default: null
	},
	oAuthId: String
});

module.exports = model("users", userSchema);
