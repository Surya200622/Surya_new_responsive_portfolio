import nodemailer from 'nodemailer';
import { db } from '@/db';
import { siteSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const sendEmail = async ({
  to,
  subject,
  html,
  replyTo,
}: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}) => {
  // Try to get from DB first
  let emailUser = process.env.EMAIL_USER;
  let emailPass = process.env.EMAIL_PASS;

  try {
    const userSetting = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, 'EMAIL_USER'))
      .limit(1);
    const passSetting = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, 'EMAIL_PASS'))
      .limit(1);

    if (userSetting.length > 0 && userSetting[0].value) {
      emailUser = userSetting[0].value;
    }
    if (passSetting.length > 0 && passSetting[0].value) {
      emailPass = passSetting[0].value;
    }
  } catch (error) {
    console.error('Failed to get email config from DB, falling back to ENV', error);
  }

  if (!emailUser || !emailPass) {
    throw new Error('Email configuration is missing');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  return await transporter.sendMail({
    from: `"Portfolio Admin" <${emailUser}>`,
    to,
    replyTo,
    subject,
    html,
  });
};
