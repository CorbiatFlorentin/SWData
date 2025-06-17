// mailer.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: +process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Check start 
transporter.verify((err, success) => {
  if (err) {
    console.error('❌ SMTP config error:', err);
  } else {
    console.log('✅ SMTP ready to send');
  }
});

module.exports = transporter;
