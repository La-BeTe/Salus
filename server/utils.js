const MailGen = require("mailgen");
const nodemailer = require("nodemailer");
const cryptoRandomString = require("crypto-random-string");

const mailTransport = nodemailer.createTransport({
	port: 465,
	host: process.env.MAILER_HOST,
	auth: {
		user: process.env.MAILER_USERNAME,
		pass: process.env.MAILER_PASSWORD
	}
});

module.exports.generatePasswordResetEmail = function(user){
    const mailGenerator = new MailGen({
        theme: "cerberus",
        product: {
            // Th produce's name is an empty string so the app name doesn't 
            // show up at the top of the mail
            name: " ",
            link: process.env.SITE_URL,
            logo: `${process.env.SITE_URL}/favicon.ico`,
            copyright: `© ${new Date().getFullYear()} <a href="${process.env.SITE_URL}">${String(process.env.APP_NAME).toUpperCase()}</a>.<br />All rights reserved.`
        }
    });
	const email = {
		body: {
            name: user.name,
            signature: false,
			intro: [
				"You have received this email because a password reset request for your account was received.",
				`Do note that this link will be valid for the next ${Number(process.env.RESET_TOKEN_EXPIRY) || 6} hours.`
			],
			action: {
				instructions: "Click below to reset your password:",
				button: {
                    fallback: true,
					color: "#0459AC",
					text: "Reset your password",
					link: `${process.env.SITE_URL}/reset-password/${encodeURIComponent(user.resetToken)}`
				}
			},
			outro:
				"If you did not request a password reset, no further action is required on your part."
		}
	};
	return [mailGenerator.generate(email), mailGenerator.generatePlaintext(email)];
}

module.exports.sendEmail = async function(to, subject, html, text){
	const mailOptions = {
		to,
		html,
		text,
		subject,
		from: process.env.MAILER_ADDRESS,
	};
	await mailTransport.sendMail(mailOptions);
};

module.exports.generateRandomString = function(length){
    length = Number(length)|| 20;
    return cryptoRandomString({ length })
}