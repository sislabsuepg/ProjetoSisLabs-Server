import nodemailer, { Transporter, SendMailOptions, SentMessageInfo } from 'nodemailer';

interface MailOptions extends SendMailOptions {
    from?: {
        address: string;
        name: string;
    };
}

class Email {
    private mailOptions: MailOptions;
    private transporter: Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });

        this.mailOptions = {
            from: {
                address: process.env.EMAIL || '',
                name: 'SISLABS'
            }
        };
    }

    setCompanyName(name: string): void {
        if (this.mailOptions.from && typeof this.mailOptions.from === 'object') {
            this.mailOptions.from.name = name;
        } else {
            this.mailOptions.from = {
                address: process.env.EMAIL || '',
                name: name
            };
        }
    }

    setSenderEmail(email: string): void {
        if (this.mailOptions.from && typeof this.mailOptions.from === 'object') {
            this.mailOptions.from.address = email;
        } else {
            this.mailOptions.from = {
                address: email,
                name: 'SISLABS'
            };
        }
    }

    setTo(receiver: string | string[]): void {
        this.mailOptions.to = receiver;
    }

    setSubject(subject: string): void {
        this.mailOptions.subject = subject;
    }

    setText(text: string): void {
        this.mailOptions.text = text;
    }

    setHTML(html: string): void {
        this.mailOptions.html = html;
    }

    setCc(cc: string | string[]): void {
        this.mailOptions.cc = cc;
    }

    setBcc(bcc: string | string[]): void {
        this.mailOptions.bcc = bcc;
    }

    setAttachments(attachments: SendMailOptions['attachments']): void {
        this.mailOptions.attachments = attachments;
    }

    send(callback?: (error: Error | null, info: SentMessageInfo) => void): void {
        this.transporter.sendMail(this.mailOptions, (error: Error | null, info: SentMessageInfo) => {
            if (error) {
                console.error('Erro ao enviar email:', error);
                if (callback) callback(error, info);
                return;
            }
            
            console.log('Email enviado com sucesso:', info.response);
            if (callback) callback(null, info);
        });
    }

    async sendAsync(): Promise<SentMessageInfo> {
        try {
            const info = await this.transporter.sendMail(this.mailOptions);
            console.log('Email enviado com sucesso:', info.response);
            return info;
        } catch (error) {
            console.error('Erro ao enviar email:', error);
            throw error;
        }
    }

    clearOptions(): void {
        this.mailOptions = {
            from: {
                address: process.env.EMAIL || '',
                name: 'SISLABS'
            }
        };
    }

    async verifyConnection(): Promise<boolean> {
        try {
            await this.transporter.verify();
            console.log('Conexão com servidor de email verificada com sucesso');
            return true;
        } catch (error) {
            console.error('Falha ao conectar com servidor de email:', error);
            return false;
        }
    }

    getCurrentOptions(): MailOptions {
        return { ...this.mailOptions };
    }
}

export default Email;