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
		required: true
	},
	password: String,
	resetToken: String,
	resetTokenExpiry: {
		type: Number,
		default: 0
	},
	rememberMeToken: String,
	oAuthId: String
});

module.exports = model("users", userSchema);
