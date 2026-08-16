import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS) {
      this.transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT || 587,
        secure: env.SMTP_PORT === 465,
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        },
      });
    }
  }

  public async sendEmail(options: {
    to: string;
    subject: string;
    text?: string;
    html?: string;
    attachments?: Array<{ filename: string; content: Buffer }>;
  }): Promise<boolean> {
    if (!this.transporter) {
      console.log(`[Mock Email Sent] To: ${options.to} | Subject: ${options.subject}`);
      return true;
    }

    try {
      await this.transporter.sendMail({
        from: env.EMAIL_FROM,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        attachments: options.attachments,
      });
      return true;
    } catch (error) {
      console.error('❌ Failed to send email via SMTP:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();
