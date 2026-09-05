import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function GET() {
  try {
    const newPasscode = `SHAM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // إعداد مرسل البريد
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_GMAIL,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // إرسال البريد الإلكتروني
    await transporter.sendMail({
      from: process.env.ADMIN_GMAIL,
      to: process.env.ADMIN_GMAIL,
      subject: "🔑 رمز المرور الخاص بـ Sham AI",
      text: `رمز المرور الجديد الخاص بك (صالح لمدة 30 دقيقة):\n${newPasscode}`,
    });

    return NextResponse.json({ success: true, passcode: newPasscode });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}