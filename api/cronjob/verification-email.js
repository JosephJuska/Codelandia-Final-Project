const emailConfig = require('../config/email');

const nodemailer = require('nodemailer');
const logData = require('../utils/log-data');

const apiConfig = require('../config/api');

const transporter = nodemailer.createTransport({
    host: emailConfig.EMAIL_HOST,
    port: emailConfig.EMAIL_PORT,
    secure: false,
    auth: {
        user: emailConfig.EMAIL,
        pass: emailConfig.EMAIL_PASSWORD
    }
});

const sendEmail = async (email, subject, text, html) => {
    let error;
    try {
        await transporter.sendMail({
            from: `"Techno" <${emailConfig.EMAIL}>`,
            to: email,
            subject: subject,
            text: text,
            html: html
        });
    } catch (e) {
        error = e;
    } finally {
        const logEntry = {
            success: error ? false : true,
            email,
            subject,
            text,
            html,
            error
        }
        logData(logEntry, 'email');
    }
};

const sendAccountVerification = async (email, token) => {
    const subject = 'Account Verification For Techno';
    const verificationLink = `http://localhost:${apiConfig.API_PORT}/verify/account/${token}`;
    const text = `Please verify your account by clicking the link: ${verificationLink}`;
    const html = `<p>Please verify your account by clicking the link below:</p><a href="${verificationLink}">Verify Account</a>`;

    return await sendEmail(email, subject, text, html);    
};

const sendEmailVerification = async (email, token) => {
    const subject = 'Email Verification For Techno';
    const verificationLink = `http://localhost:${apiConfig.API_PORT}/verify/email/${token}`;
    const text = `Please verify your new email address by clicking the link: ${verificationLink}`;
    const html = `<p>Please verify your new email address by clicking the link below:</p><a href="${verificationLink}">Verify Email</a>`;

    return await sendEmail(email, subject, text, html);
};

const sendPasswordVerification = async (email, token) => {
    const subject = 'Password Reset Request For Techno';
    const verificationLink = `http://localhost:${apiConfig.API_PORT}/verify/reset-password/${token}`;
    const text = `Please reset your password by clicking the link: ${verificationLink}`;
    const html = `<p>Please reset your password by clicking the link below:</p><a href="${verificationLink}">Reset Password</a>`;

    return await sendEmail(email, subject, text, html);
};

const sendDeleteVerification = async (email, token) => {
    const subject = 'Account Deletion Request for Techno';
    const verificationLink = `http://localhost:${apiConfig.API_PORT}/verify/delete/${token}`;
    const text = `Please confirm the deletion of your account by clicking the link: ${verificationLink}`;
    const html = `<p>Please confirm the deletion of your account by clicking the link below:</p><a href="${verificationLink}">Delete Account</a>`;

    return await sendEmail(email, subject, text, html);
};

module.exports = {
    sendAccountVerification,
    sendEmailVerification,
    sendPasswordVerification,
    sendDeleteVerification
};