import nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

interface MailOptions {
    to: string;
    subject: string;
    text: string;
    html?: string;
}

export default class EmailService {
    private transporter: Transporter<SMTPTransport.SentMessageInfo>;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        } as SMTPTransport.Options);
    }

    async sendMail(mailOptions: MailOptions): Promise<{ success: boolean; response: string }> {
        if (!mailOptions.to || !mailOptions.subject || !mailOptions.text) {
            throw new Error('Campos obrigatórios faltando: to, subject ou text');
        }

        const info = await this.transporter.sendMail({
            from: {
                name: 'SISLABS',
                address: process.env.EMAIL || ''
            },
            ...mailOptions
        });
        
        return {
            success: true,
            response: info.response
        };
    }
}