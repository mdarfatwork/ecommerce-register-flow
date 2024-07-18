import nodemailer from "nodemailer";
import dotenv from "dotenv";
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

export async function POST(req) {
  try {
    const { email, name } = await req.json();
    const subject = "Your Verification Code from Arfat Ecom";
    const verificationCode = generateVerificationCode(8);

    // HTML email template with placeholders replaced
    const htmlTemplate = `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head> <meta name="viewport" content="width=device-width, initial-scale=1.0"/> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/> <title>Verify your email address - Arfat Ecom</title> <style type="text/css" rel="stylesheet" media="all"> /* Base ------------------------------ */ *:not(br):not(tr):not(html){font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; -webkit-box-sizing: border-box; box-sizing: border-box;}body{width: 100% !important; height: 100%; margin: 0; line-height: 1.4; background-color: #F5F7F9; color: #839197; -webkit-text-size-adjust: none;}a{color: #414EF9;}/* Layout ------------------------------ */ .email-wrapper{width: 100%; margin: 0; padding: 0; background-color: #F5F7F9;}.email-content{width: 100%; margin: 0; padding: 0;}/* Masthead ----------------------- */ .email-masthead{padding: 25px 0; text-align: center;}.email-masthead_logo{max-width: 400px; border: 0;}.email-masthead_name{font-size: 16px; font-weight: bold; color: #839197; text-decoration: none; text-shadow: 0 1px 0 white;}/* Body ------------------------------ */ .email-body{width: 100%; margin: 0; padding: 0; border-top: 1px solid #E7EAEC; border-bottom: 1px solid #E7EAEC; background-color: #FFFFFF;}.email-body_inner{width: 570px; margin: 0 auto; padding: 0;}.email-footer{width: 570px; margin: 0 auto; padding: 0; text-align: center;}.email-footer p{color: #839197;}.body-action{width: 100%; margin: 30px auto; padding: 0; text-align: center;}.code{font-size: 30px; font-weight: 700; color: Black;}.body-sub{margin-top: 25px; padding-top: 25px; border-top: 1px solid #E7EAEC;}.content-cell{padding: 35px;}.align-right{text-align: right;}/* Type ------------------------------ */ h1{margin-top: 0; color: #292E31; font-size: 19px; font-weight: bold; text-align: left;}h2{margin-top: 0; color: #292E31; font-size: 16px; font-weight: bold; text-align: left;}h3{margin-top: 0; color: #292E31; font-size: 14px; font-weight: bold; text-align: left;}p{margin-top: 0; color: #839197; font-size: 16px; line-height: 1.5em; text-align: left;}p.sub{font-size: 12px;}p.center{text-align: center;}/* Buttons ------------------------------ */ .button{display: inline-block; width: 200px; background-color: #414EF9; border-radius: 3px; color: #ffffff; font-size: 15px; line-height: 45px; text-align: center; text-decoration: none; -webkit-text-size-adjust: none; mso-hide: all;}/*Media Queries ------------------------------ */ @media only screen and (max-width: 600px){.email-body_inner, .email-footer{width: 100% !important;}}@media only screen and (max-width: 500px){.button{width: 100% !important;}}</style></head><body> <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0"> <tr> <td align="center"> <table class="email-content" width="100%" cellpadding="0" cellspacing="0"> <tr> <td class="email-masthead"> <a class="email-masthead_name"><svg width="50" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 710 568.71"><path fill="currentColor" d="M270.72 427.89h-79.85a2.9 2.9 0 01-2.46-1.37l-51.6-83.33-51.62 83.33a2.87 2.87 0 01-2.45 1.37H2.9a2.89 2.89 0 01-2.4-4.51L96.36 280.9 1.68 143.35a2.89 2.89 0 012.38-4.53h80.33a2.88 2.88 0 012.44 1.36l50 79.51 49.67-79a3.88 3.88 0 013.3-1.83h79.77a2.89 2.89 0 012.38 4.53L177.24 280.9l95.88 142.48a2.9 2.9 0 01-2.4 4.51zM424.65.01a282.59 282.59 0 00-208 90.9 1.47 1.47 0 001.08 2.45h12.57a2.86 2.86 0 001.87-.71 256.49 256.49 0 01168.92-63c141.47 0 256.14 113.6 256.14 253.73S542.6 537.09 401.13 537.09a256.51 256.51 0 01-168.92-63 2.86 2.86 0 00-1.87-.71h-12.57a1.47 1.47 0 00-1.08 2.45 282.59 282.59 0 00208 90.9C581.14 566.71 708 439.84 708 283.35S581.14.01 424.65.01zM537 309.09H323.47c1.87 32.38 30.45 60.31 71.9 60.31 31.92 0 52.26-12.7 64.6-32.2a2.89 2.89 0 013.78-1.06l54 28a2.9 2.9 0 011.1 4.16C493.14 407.14 449 432.8 395 432.8h-.4c-85.55 0-144.13-62.6-144.13-149.45S309 133.91 394.55 133.91s147.17 66.91 147.17 149.44a147 147 0 01-1.65 22.55c-.28 1.5-1.33 3.19-3.07 3.19zm-67.1-58.5c-4.47-18.38-26-53.3-71.91-53.3-44.1 0-66.77 27.59-72.15 53.3z"></path></svg></a> </td></tr><tr> <td class="email-body" width="100%"> <table class="email-body_inner" align="center" width="570" cellpadding="0" cellspacing="0"> <tr> <td class="content-cell"> <h1>Email Verification Code</h1> <p>Hi ${name},</p><p>Thanks for signing up for Arfat Ecom! We're excited to have you as an early user.</p><table class="body-action" align="center" width="100%" cellpadding="0" cellspacing="0"> <tr> <td align="center"> <div class="code"> ${verificationCode}</div></td></tr></table> <p>Thanks,<br>The Arfat Ecom Team</p></td></tr></table> </td></tr><tr> <td> <table class="email-footer" align="center" width="570" cellpadding="0" cellspacing="0"> <tr> <td class="content-cell"> <p class="sub center"> Arfat Ecom, Inc. <br>1145 Nicholson Rd, Suite 200,Newmarket, Canada </p></td></tr></table> </td></tr></table> </td></tr></table></body></html>
    `;

    if (!email) {
      console.error("No recipient email provided");
      return NextResponse.json({ error: "No recipient email provided" }, { status: 400 });
    }

    const mailOptions = {
      from: process.env.SMTP_MAIL,
      to: email,
      subject: subject,
      html: htmlTemplate,
    };

    // Send mail using Nodemailer
    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.error(`Error sending email: ${error}`);
          resolve(NextResponse.json({ error: "Failed to send email" }, { status: 500 }));
        } else {
          console.log("Email sent successfully!");
          resolve(NextResponse.json({ code: verificationCode }, { status: 200 }));
        }
      });
    });
  } catch (error) {
    console.error(`Internal server error: ${error}`);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}