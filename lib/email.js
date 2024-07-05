const path = require('path');
const fs = require('fs/promises');
const nodemailer = require("nodemailer");
const htmlToText = require('html-to-text');

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    }
});

// async..await is not allowed in global scope, must use a wrapper
async function sendMail(mailOptions) {
    let html = await fs.readFile(path.join(__dirname, `../views/templates/${mailOptions.template}.html`), 'utf8');

    if (!html) {
        throw new Error(`No template found for ${mailOptions.template}`);
    }

    html = html.replace('{{origin}}', process.env.ORIGIN);

    if (mailOptions.template === 'forgot-password' || mailOptions.template === 'confirm-email-change') {
        html = html.replace('{{token}}', mailOptions.data.token);
    }

    const text = htmlToText.htmlToText(html);

    // send mail with defined transport object
    return await transporter.sendMail({
        from: '"Safe Secret" <info@safesecret.com>', // sender address
        to: mailOptions.to, // list of receivers
        subject: mailOptions.subject, // Subject line
        text: text, // plain text body
        html: html, // html body
    });
}

module.exports = {
    sendMail
}