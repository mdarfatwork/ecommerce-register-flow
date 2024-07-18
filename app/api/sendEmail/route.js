import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "fs";
import { NextResponse } from "next/server";

dotenv.config();

let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

function generateVerificationCode(length) {
  const chars = "0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

const emailTemplate = fs.readFileSync(`https://ecommerce-register-flow-hz8vq3ntu-mdarfatworks-projects.vercel.app/template/email.html`, "utf-8");

export async function POST(req) {
  try {
    const { email, name } = await req.json();
    const subject = "Your Verification Code from Arft Ecom";
    const code = generateVerificationCode(8);
    const message = emailTemplate
      .replace("{name}", name)
      .replace("{verificationCode}", code);

    if (!email) {
      console.error("No recipients defined");
      return NextResponse.json({ error: "No recipients defined" }, { status: 400 });
    }

    const mailOptions = {
      from: process.env.SMTP_MAIL,
      to: email,
      subject: subject,
      html: message,
    };

    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.error(`This is the Error of if else and error of if block in Send Mail is ${error}`);
          resolve(NextResponse.json({ error: "Failed to send email" }, { status: 500 }));
        } else {
          console.log("Email sent successfully!");
          resolve(NextResponse.json({ code: code }, { status: 200 }));
        }
      });
    });
  } catch (error) {
    console.error(`This is the Error of catch block in Send Mail is ${error}`);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}