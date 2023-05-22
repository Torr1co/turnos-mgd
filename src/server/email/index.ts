import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const sendEmail = (to: string, from: string, subject: string, text: string) => {
  const msg = {
    to,
    from,
    subject,
    text,
  };
  return sgMail.send(msg);
};

export default sendEmail;

// sgMail
//   .send(msg)
//   .then((response) => {
//     console.log(response[0].statusCode);
//     console.log(response[0].headers);
//   })
//   .catch((error) => {
//     console.error(error);
//   });
