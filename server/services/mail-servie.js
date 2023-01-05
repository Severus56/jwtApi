const nodemailer = require('nodemailer')

class mailService{

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: "smtp.mail.ru",
            port: 465,
            secure: true,
            auth: {
                user: 'severustestmail@mail.ru',
                pass: 'F288vrY5uepu0Pk2a8iu'
            }
        })
    }

    async sendActivationMail(to, activationLink) {
        await this.transporter.sendMail({
            from: 'severustestmail@mail.ru',
            to,
            subject: `Активация аккаунта на ${process.env.API_URL}`,
            text: '',
            html:
            `
                <div>
                    <h1>Для активации перейдите по ссылке</h1>
                    <a href="${activationLink}">${activationLink}</a>
                </div>
            `
        })
    }
}

module.exports = new mailService();