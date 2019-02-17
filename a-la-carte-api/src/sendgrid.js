// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: 'jschopick15@gmail.com',
  from: 'justin@schopick.com',
  subject: 'Testing Sengrid API',
  text: 'Easy to do anywhere, even with Node.js',
  html: '<strong>Easy to do anywhere, even with Node.js</strong>',
};
sgMail.send(msg);

console.log("Sent email");
