import { createTransport } from "nodemailer";
import { type SendEmail } from ".";
// import type SMTPConnection from "nodemailer/lib/smtp-connection";

const CONFIG = {
  host: "localhost",
  port: 1025,
  auth: {
    user: "project.1",
    pass: "secret.1",
  },
};

const transporter = createTransport(CONFIG);

transporter.verify(function (error) {
  if (error) {
    console.error(error);
  } else {
    console.log(
      `SMTP server is ready to take system messages at ${CONFIG.host}:${CONFIG.port}`
    );
  }
});

export async function systemEmail(msg: SendEmail) {
  const result = await transporter.sendMail(msg);

  return result;
}
