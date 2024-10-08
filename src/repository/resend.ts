import { ReactElement } from "react";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (email: string, subject: string, body: ReactElement) => {
  const { data, error } = await resend.emails.send({
    from: "Paptaii <forgotpassword@paptaii.com>",
    to: email,
    subject,
    react: body,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
 