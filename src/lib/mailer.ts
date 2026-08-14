import nodemailer from 'nodemailer';

const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT || 587);
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;

let transporter: nodemailer.Transporter | null = null;
if (host && user && pass) {
  transporter = nodemailer.createTransport({ host, port, auth: { user, pass }, secure: port === 465 });
}

export async function sendBookingEmail(to: string, subject: string, html: string) {
  if (!transporter) {
    console.warn('SMTP not configured; skipping email');
    return;
  }
  await transporter.sendMail({ from: process.env.SMTP_FROM || (user as string), to, subject, html });
}
