const nodemailer = require('nodemailer');

class MailService {
  // constructor() {
  //   this.transporter = nodemailer.createTransport({
  //     host: process.env.SMTP_HOST,
  //     port: process.env.SMTP_PORT,
  //     secure: false,
  //     auth: {
  //       user: process.env.SMTP_USER,
  //       pass: process.env.SMTP_PASSWORD,
  //     }
  //   });
  // }

  initTransporter() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      }
    });
  }

  async sendActivationEmail(to, link) {
    if (!this.transporter) {
      this.initTransporter();
    }

    console.log(`Send email to ${to}, activation link: ${link}`);

    // this.transporter.sendMail({
    //   from: process.env.SMTP_USER,
    //   to,
    //   subject: `Account activation on ${process.env.API_URL}`,
    //   text: '',
    //   html: `
    //     <div>
    //         <h1>Use activation link to activate user</h1>
    //         <a href="${link}">${link}</a>
    //     </div>
    //   `,
    // });
  }
}

module.exports = new MailService();
