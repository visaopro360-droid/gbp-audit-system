const nodemailer = require('nodemailer');

// Configuração do transporte de email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD
  }
});

// Função para enviar relatório por email
async function sendReportEmail(to, businessName, htmlReport) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: to,
      subject: `GBP Audit Report - ${businessName}`,
      html: htmlReport
    });
    console.log(`✅ Email enviado para ${to}`);
    return true;
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    return false;
  }
}

module.exports = { sendReportEmail };