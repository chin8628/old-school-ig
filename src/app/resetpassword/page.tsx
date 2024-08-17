import { ResetPasswordForm } from "@/app/resetpassword/ResetPasswordForm";
import { validateResetPasswordToken } from "@/service/resetPassword";
import Link from "next/link";

type ResetPasswordPageProps = {
  searchParams: {
    token: string;
  };
};

export default async function ResetPasswordPage(props: ResetPasswordPageProps) {
  const token = props.searchParams.token;
  let isTokenValid = await validateResetPasswordToken(token);

  return (
    <div className="flex items-center justify-center h-screen bg-slate-50">
      <div className="w-full max-w-[400px] py-2 flex flex-col items-center">
        {isTokenValid ? (
          <>
            <h1 className="mb-8 text-3xl font-semibold text-center">Update your new password</h1>
            <ResetPasswordForm token={token} />
          </>
        ) : (
          <>
            <p className="mb-4 text-center">The reset password's token is invalid or has expired.</p>
            <Link href="/signin">Sign in</Link>
          </>
        )}
      </div>
    </div>
  );
}
