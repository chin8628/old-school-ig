import { prisma } from "@/repository/db";
import { sendEmail } from "@/repository/resend";
import { randomUUID } from "crypto";

const ONE_DAY = 24 * 60 * 60 * 1000;

const generateResetPasswordToken = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const token = randomUUID().replace("-", "");
  try {
    await prisma.resetPassword.create({
      data: {
        token,
        userId: user.id,
        expireAt: new Date(Date.now() + ONE_DAY),
      },
    });
  } catch (e) {
    console.error(e);
    throw new Error("Unable to create token");
  }

  return token;
};

export const sendResetPasswordEmail = async (email: string) => {
  const token = await generateResetPasswordToken(email);
  const url = `${process.env.WEB_URL}/resetpassword?token=${token}`;
  const emailTemplate = (
    <div>
      <h1>Request to reset password</h1>
      <p>
        You have requested to reset your password. Please click the link below to reset your password. If you did not,
        please ignore this email.
      </p>
      <p>
        <strong>Do not share this link with anyone.</strong>
      </p>
      <p>
        Click <a href={url}>{url}</a> to reset your password.
      </p>
    </div>
  );

  await sendEmail(email, "Reset Password", emailTemplate);
};

export const validateResetPasswordToken = async (token: string) => {
  const resetPassword = await prisma.resetPassword.findUnique({
    where: {
      token,
      expireAt: {
        gte: new Date(),
      },
    },
  });

  return !!resetPassword;
};
