import { ForgotPasswordForm } from "@/app/forgotpassword/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-slate-50">
      <div className="w-full max-w-[400px] py-2 flex flex-col items-center">
        <h1 className="mb-8 text-3xl font-semibold text-center">Forgot Password?</h1>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
