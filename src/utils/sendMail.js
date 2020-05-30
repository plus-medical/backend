const sgMail = require('@sendgrid/mail');

const { config } = require('../config');

async function sendMail(email, subject, html) {
  const message = {
    to: email,
    from: config.businessMail,
    subject,
    html,
  };
  await sgMail.send(message);
}

module.exports = sendMail;
