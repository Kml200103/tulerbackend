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


  async sendNewsletterSubscriptionEmail(email) {
    const confirmationUrl = `${config.frontendUrl}/confirm-subscription/?email=${encodeURIComponent(email)}`;
    
    const mailOptions = {
      from: config.userEmail,
      to: email,
      subject: ' Newsletter Subscription Confirmation',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
          <h2 style="text-align: center; color: #333;">Welcome to Our Newsletter!</h2>
          <p style="color: #555; font-size: 16px;">Thank you for subscribing to our newsletter! We’re excited to keep you updated with the latest news and special offers.</p>
          
       
          
         
  
          <p style="color: #777; font-size: 14px; text-align: center;">If you didn’t request this, you can safely ignore this email.</p>
        </div>
      `,
    };
  
    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Newsletter subscription email sent to ${email}`);
    } catch (error) {
      console.error('Error sending newsletter email:', error.message);
      throw new Error('Failed to send email');
    }
  }
  
  async sendOrderConfirmationEmail(email, orderId, items, total) {
    const itemsTable = items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.price.toFixed(2)}</td>
      </tr>
    `).join('');

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Order Placed Successfully!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #4CAF50; text-align: center;">Order Confirmation</h2>
            <p style="font-size: 16px; text-align: center;">Thank you for your order! Your order has been placed successfully.</p>
            <p style="font-size: 16px; text-align: center;"><strong>Order ID:</strong> ${orderId}</p>
            
            <h3 style="background-color: #f8f8f8; padding: 10px; text-align: center; border-radius: 5px;">Order Details</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
              <thead>
                <tr style="background-color: #f2f2f2;">
                  <th style="text-align: left; padding: 10px; border-bottom: 2px solid #ddd;">Item</th>
                  <th style="text-align: center; padding: 10px; border-bottom: 2px solid #ddd;">Quantity</th>
                  <th style="text-align: center; padding: 10px; border-bottom: 2px solid #ddd;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsTable}
                <tr style="background-color: #f8f8f8;">
                  <td colspan="2" style="padding: 10px; text-align: right;"><strong>Total</strong></td>
                  <td style="padding: 10px; text-align: center;"><strong>${total.toFixed(2)}</strong></td>
                </tr>
              </tbody>
            </table>

            <p style="font-size: 14px; text-align: center; margin-top: 20px;">If you have any questions about your order, contact us at <a href="mailto:support@example.com" style="color: #4CAF50;">support@example.com</a>.</p>

            <footer style="margin-top: 20px; text-align: center; font-size: 12px; color: #666;">
              <p>&copy; 2024 Your Company. All rights reserved.</p>
            </footer>
          </div>
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
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">$${item.price.toFixed(2)}</td>
    </tr>
  `).join('');

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Order Cancellation Confirmation',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #FF0000; text-align: center;">Order Cancellation</h2>
        <p style="font-size: 16px; text-align: center;">We regret to inform you that your order has been cancelled.</p>
        <p style="font-size: 16px; text-align: center;"><strong>Order ID:</strong> ${orderId}</p>
        
        <h3 style="background-color: #f8f8f8; padding: 10px; text-align: center; border-radius: 5px;">Cancelled Items</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="text-align: left; padding: 10px; border-bottom: 2px solid #ddd;">Item</th>
              <th style="text-align: center; padding: 10px; border-bottom: 2px solid #ddd;">Quantity</th>
              <th style="text-align: center; padding: 10px; border-bottom: 2px solid #ddd;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsTable}
            <tr style="background-color: #f8f8f8;">
              <td colspan="2" style="padding: 10px; text-align: right;"><strong>Refund Amount</strong></td>
              <td style="padding: 10px; text-align: center;"><strong>$${refundAmount.toFixed(2)}</strong></td>
            </tr>
          </tbody>
        </table>

        <p style="font-size: 14px; text-align: center; margin-top: 20px;">If you have any questions, contact us at <a href="mailto:support@example.com" style="color: #FF0000;">support@example.com</a>.</p>
        <p style="font-size: 14px; text-align: center;">We hope to serve you again in the future!</p>

        <footer style="margin-top: 20px; text-align: center; font-size: 12px; color: #666;">
          <p>&copy; 2024 Your Company. All rights reserved.</p>
        </footer>
      </div>
    `,
  };

  try {
    await this.transporter.sendMail(mailOptions);
    console.log(`Order cancellation email sent to ${email}`);
  } catch (error) {
    console.error('Error sending cancellation email:', error.message);
  }
}

}
const emailService = new EmailService();
export default emailService

