const { KnownError } = require("./errors.controller");

class Validator {
	constructor(...required) {
		this.errors = [];
		this.required = required;
	}
	hasErrors() {
		return this.errors.length > 0;
	}
	getErrors() {
		if (this.hasErrors()) {
			return this.errors.join("\n");
		}
		return null;
	}
	setError(error) {
		if (typeof error === "string" && error.length > 0) {
			this.errors.push(error);
		} else throw "setError expects a string argument";
	}

	validate(req, _, next) {
		const validatedBody = this.validateBody({ ...req.body });
		if (this.hasErrors()) next(new KnownError(this.getErrors(), 400));
		else {
			req.body = { ...validatedBody };
			next();
		}
	}

	validateName(name) {
		name = name.trim();
		if (!name) this.setError("Name is required");
		else if (name.length < 4) this.setError("Your name is too short");
		else if (/[^a-zA-Z\s]/.test(name))
			this.setError("Name should only contain letters and spaces");
		return name;
	}

	validatePassword(password) {
		password = password.trim();
		if (!password) this.setError("Password is required");
		else if (password.length < 8)
			this.setError(
				"Your password is too short, the minimum length is 8"
			);
		else if (/\s/.test(password))
			this.setError("Pasword must not contain spaces");
		else if (
			!/\W/.test(password) ||
			!/[a-z]/.test(password) ||
			!/[A-Z]/.test(password)
		)
			this.setError(
				"Pasword must contain one symbol, one lowercase and one uppercase character"
			);
		return password;
	}

	validateEmail(email) {
		email = email.trim();
		const emailRegExp = /^(\D)+(\w)*((\.(\w)+)?)+@(\D)+(\w)*((\.(\D)+(\w)*)+)?(\.)[a-z]{2,}$/;
		if (!email) this.setError("Email is required");
		else if (!emailRegExp.test(email))
			this.setError("Your email is invalid");
		return email;
	}

	validateBody(body) {
		for (let property of this.required) {
			body[property] = body[property] || "";
		}
		// result is a default object with no errors
		const results = {};
		if (body.hasOwnProperty("name")) {
			results.name = this.validateName(body.name);
		}
		if (body.hasOwnProperty("email")) {
			results.email = this.validateEmail(body.email);
		}
		if (body.hasOwnProperty("password")) {
			results.password = this.validatePassword(body.password);
		}
		if (body.hasOwnProperty("old-password")) {
			// No need to validate old password, just pass it back so it is present in req.body
			results["old-password"] = body["old-password"];
		}
		if (body.hasOwnProperty("remember-me")) {
			// Passing remember-me checkbox value to results, no need to validate
			results["remember-me"] = body["remember-me"];
		}
		if (body.hasOwnProperty("confirm-password")) {
			// No need to add confirm password to req.body as it should be thesame as password
			if (body["confirm-password"] !== body.password)
				this.setError("Password and Confirm Password must be thesame");
		}
		return results;
	}
}

module.exports = function (...required) {
	return function (req, res, next) {
		const newValidator = new Validator(...required);
		newValidator.validate(req, res, next);
	};
};
