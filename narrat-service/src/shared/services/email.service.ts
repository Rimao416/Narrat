import nodemailer from 'nodemailer';

export class EmailService {
  private static transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  static async sendPasswordResetEmail(to: string, resetToken: string) {
    // Dans une vraie application, le lien pointerait vers l'app mobile ou un site web
    const resetLink = `narrat://reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Narrat App" <noreply@narrat.app>',
      to,
      subject: 'Réinitialisation de votre mot de passe - Narrat',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #6C5CE7;">Réinitialisation de mot de passe</h2>
          <p>Bonjour,</p>
          <p>Vous avez demandé à réinitialiser votre mot de passe sur Narrat. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #6C5CE7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Réinitialiser mon mot de passe</a>
          </div>
          <p>Si le bouton ne fonctionne pas, vous pouvez copier ce lien : <br>
          <a href="${resetLink}">${resetLink}</a></p>
          <p style="color: #7f8c8d; font-size: 12px; margin-top: 40px;">Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email. Ce lien expirera dans 1 heure.</p>
        </div>
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      if (process.env.NODE_ENV !== 'production' && !process.env.SMTP_USER) {
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      }
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error("Impossible d'envoyer l'email de réinitialisation");
    }
  }
}
