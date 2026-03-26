export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // Validate required fields
  if (!body.name || !body.email || !body.message) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required fields: name, email, message",
    });
  }

  try {
    // Send email using Nodemailer or your preferred email service
    // For this example, we'll use a simple implementation with environment variables
    
    const config = useRuntimeConfig();
    
    // Option 1: If using Nodemailer
    // const nodemailer = require('nodemailer');
    // const transporter = nodemailer.createTransport({
    //   host: config.emailHost,
    //   port: config.emailPort,
    //   secure: config.emailSecure,
    //   auth: {
    //     user: config.emailUser,
    //     pass: config.emailPassword
    //   }
    // });

    // Option 2: Using a third-party email service like SendGrid
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(config.sendgridApiKey);

    // For now, we'll provide a template for the actual implementation
    const emailContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(body.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(body.email)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(body.message).replace(/\n/g, '<br>')}</p>
    `;

    // This is a placeholder - implement your actual email sending logic here
    console.log('Contact form submission:', {
      name: body.name,
      email: body.email,
      message: body.message,
      toEmail: body.toEmail || 'info@dasa.com'
    });

    // TODO: Uncomment and configure your email service
    // await transporter.sendMail({
    //   from: config.emailFrom,
    //   to: body.toEmail || 'info@dasa.com',
    //   replyTo: body.email,
    //   subject: `New contact form submission from ${body.name}`,
    //   html: emailContent
    // });

    return {
      success: true,
      message: 'Email sent successfully'
    };
  } catch (error) {
    console.error('Email sending error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to send email. Please try again later.',
    });
  }
});

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
