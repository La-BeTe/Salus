const MailGen = require("mailgen");
const nodemailer = require("nodemailer");

let mailGenerator = new MailGen({
	theme: "salted",
	product: {
		name: "MERN Authenticator App",
		link: process.env.SITE_URL
	}
});

let transport = nodemailer.createTransport({
	host: "smtp.hostinger.com",
	port: 587,
	auth: {
		user: process.env.MAILER_USERNAME,
		pass: process.env.MAILER_PASSWORD
	}
});

function generatePasswordResetEmail(user, resetToken) {
	let email = {
		body: {
			name: user.name,
			intro: [
				"You have received this email because a password reset request for your account was received.",
				"Do note that this link will be valid for the next 6 hours."
			],
			action: {
				instructions: "Click below to reset your password:",
				button: {
					color: "#0459AC",
					text: "Reset your password",
					link: `${
						process.env.SITE_URL
					}/reset-password/${encodeURIComponent(resetToken)}`
				}
			},
			outro:
				"If you did not request a password reset, no further action is required on your part."
		}
	};
	let emailBody = mailGenerator.generate(email);
	let emailText = mailGenerator.generatePlaintext(email);
	return [emailBody, emailText];
}

module.exports = function (user, resetToken) {
	return new Promise((res, rej) => {
		let emailBodyAndText = generatePasswordResetEmail(user, resetToken);
		let mailOptions = {
			from: process.env.MAILER_USERNAME,
			to: user.email,
			subject: "Password Reset",
			html: emailBodyAndText[0],
			text: emailBodyAndText[1]
		};
		transport.sendMail(mailOptions, (err) => {
			if (err) rej(err);
			else res();
		});
	});
};
