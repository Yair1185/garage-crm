const nodemailer = require('nodemailer');

// הגדרת חשבון לשליחת מיילים
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-app-password'
    }
});

// פונקציה לשליחת מייל
const sendMail = (to, subject, text) => {
    const mailOptions = {
        from: 'your-email@gmail.com',
        to,
        subject,
        text
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

module.exports = sendMail;
