import sgMail from "@sendgrid/mail";
// import { systemEmail } from "./nodeMailer";
// import { systemEmail } from "./nodeMailer";
// import { systemEmail } from "./nodeMailer";

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

type EmailAddress =
  | {
      name: string;
      address: string;
      email: string;
    }
  | string;

const DEFAULT_EMAIL = "v.ohmydog@gmail.com";

export const SYSTEM_ADDRESS: EmailAddress = {
  name: "¡OhMyDog!" as const,
  address: DEFAULT_EMAIL,
  email: DEFAULT_EMAIL,
};

export type SendEmail = {
  to: string;
  from?: string | EmailAddress;
  subject: string;
  text: string;
};
const sendEmail = ({ from: fromMsg = DEFAULT_EMAIL, ...msg }: SendEmail) => {
  const from =
    typeof fromMsg === "string"
      ? { ...SYSTEM_ADDRESS, address: fromMsg, email: fromMsg }
      : fromMsg;
  return sgMail
    .send({
      from,
      ...msg,
    })
    .catch(() => {
      throw new Error("Hubo un error al enviar el email");
    });
};

export default sendEmail;

// const sendEmail = (to: string, from: string, subject: string, text: string) => {
//   const msg = {
//     to,
//     from,
//     subject,
//     text,
//   };
//   return sgMail.send(msg);
// };
