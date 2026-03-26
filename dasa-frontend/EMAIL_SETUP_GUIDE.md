# Email Configuration Guide

This guide helps you set up email sending for the contact form in your Nuxt application.

## Option 1: Using SendGrid (Recommended)

### Installation
```bash
npm install @sendgrid/mail
```

### Setup in `nuxt.config.ts`
```typescript
export default defineNuxtConfig({
  runtimeConfig: {
    sendgridApiKey: process.env.SENDGRID_API_KEY,
    emailFrom: process.env.EMAIL_FROM || 'noreply@dasa.co.id',
  }
});
```

### Environment Variables (.env)
```env
SENDGRID_API_KEY=your_sendgrid_api_key_here
EMAIL_FROM=noreply@dasa.co.id
```

### Update `server/api/contact.post.ts`
```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(config.sendgridApiKey);

const msg = {
  to: body.toEmail || 'info@dasa.com',
  from: config.emailFrom,
  replyTo: body.email,
  subject: `New contact form submission from ${body.name}`,
  html: emailContent,
};

await sgMail.send(msg);
```

---

## Option 2: Using Nodemailer (Gmail, Custom SMTP)

### Installation
```bash
npm install nodemailer
```

### Setup in `nuxt.config.ts`
```typescript
export default defineNuxtConfig({
  runtimeConfig: {
    emailHost: process.env.EMAIL_HOST,
    emailPort: process.env.EMAIL_PORT,
    emailSecure: process.env.EMAIL_SECURE === 'true',
    emailUser: process.env.EMAIL_USER,
    emailPassword: process.env.EMAIL_PASSWORD,
    emailFrom: process.env.EMAIL_FROM,
  }
});
```

### Environment Variables (.env for Gmail)
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=your-email@gmail.com
```

### Update `server/api/contact.post.ts`
```typescript
import nodemailer from 'nodemailer';

const config = useRuntimeConfig();

const transporter = nodemailer.createTransport({
  host: config.emailHost,
  port: config.emailPort,
  secure: config.emailSecure,
  auth: {
    user: config.emailUser,
    pass: config.emailPassword,
  },
});

await transporter.sendMail({
  from: config.emailFrom,
  to: body.toEmail || 'info@dasa.com',
  replyTo: body.email,
  subject: `New contact form submission from ${body.name}`,
  html: emailContent,
});
```

---

## Option 3: Using Resend (Modern Alternative)

### Installation
```bash
npm install resend
```

### Setup in `nuxt.config.ts`
```typescript
export default defineNuxtConfig({
  runtimeConfig: {
    resendApiKey: process.env.RESEND_API_KEY,
    emailFrom: process.env.EMAIL_FROM || 'noreply@dasa.co.id',
  }
});
```

### Environment Variables (.env)
```env
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=noreply@dasa.co.id
```

### Update `server/api/contact.post.ts`
```typescript
import { Resend } from 'resend';

const config = useRuntimeConfig();
const resend = new Resend(config.resendApiKey);

const { data, error } = await resend.emails.send({
  from: config.emailFrom,
  to: body.toEmail || 'info@dasa.com',
  replyTo: body.email,
  subject: `New contact form submission from ${body.name}`,
  html: emailContent,
});

if (error) throw error;
```

---

## Testing

After setting up your preferred email service:

1. Fill out the contact form on the About page
2. Submit the form
3. Check that the email arrives at `info@dasa.com`
4. Verify the reply-to address is the user's email

---

## Notes

- The form currently logs to console. Remove the `console.log` once you implement actual email sending.
- Keep your API keys secure and never commit them to version control
- Consider adding rate limiting to prevent spam
- Add CAPTCHA verification for additional security
