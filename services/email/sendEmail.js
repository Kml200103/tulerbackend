import nodemailer from "nodemailer"
import config from "../../config/index.js";

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPass,
      },
    });
  }

  async sendResetPasswordEmail(email, token) {
    const resetPasswordUrl = `${config.frontendUrl}/reset-password/?email=${encodeURIComponent(email)}&token=${token}`;
    const mailOptions = {
      from: config.userEmail,
      to: email,
      subject: 'Reset Password Request',
      html: `
        <p>You requested a password reset.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetPasswordUrl}">${resetPasswordUrl}</a>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Reset password email sent to ${email}`);
    } catch (error) {
      console.error('Error sending email:', error.message);
      throw new Error('Failed to send email');
    }
  }

  async sendOrderConfirmationEmail(email, orderId, items, total) {
    // console.log('items', items)
    const itemsTable = items.map(item => `
      <tr>
     
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>${item.price}</td>
      </tr>
    `).join('');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Order Placed Successfully!',
      html: `
        <h2>Order Confirmation</h2>
        <p>Thank you for your order!</p>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <table border="1" cellspacing="0" cellpadding="5">
          <tr>
            <th>Company</th><th>Item</th><th>Quantity</th><th>Price</th>
          </tr>
          ${itemsTable}
          <tr>
            <td colspan="3"><strong>Total</strong></td>
            <td><strong>${total}</strong></td>
          </tr>
        </table>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Order confirmation email sent to ${email}`);
    } catch (error) {
      console.error('Error sending email:', error.message);
    }
  }

  async sendOrderCancellationEmail(email, orderId, items, refundAmount) {
    const itemsTable = items.map(item => `
      <tr>
        <td>${item.company}</td>
        <td>${item.name}</td>
        <td>${item.productQuantity}</td>
        <td>${item.price}</td>
      </tr>
    `).join('');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Order Cancellation Confirmation',
      html: `
        <h2>Order Cancellation</h2>
        <p>Your order has been cancelled.</p>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <table border="1" cellspacing="0" cellpadding="5">
          <tr>
            <th>Company</th><th>Item</th><th>Quantity</th><th>Price</th>
          </tr>
          ${itemsTable}
          <tr>
            <td colspan="3"><strong>Refund Amount</strong></td>
            <td><strong>${refundAmount}</strong></td>
          </tr>
        </table>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Order cancellation email sent to ${email}`);
    } catch (error) {
      console.error('Error sending email:', error.message);
    }
  }
}
const emailService = new EmailService();
export default emailService

