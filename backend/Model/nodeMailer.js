const nodemailer  = require('nodemailer');
require('dotenv').config({path:'./config.env'})

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    post: 587,
    auth: {
        user : process.env.SMTP_USER,
        pass : process.env.SMTP_PASSWORD
    }
})

module.exports = transporter; 