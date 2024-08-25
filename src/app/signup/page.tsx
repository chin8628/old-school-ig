import { SignUpForm } from "@/app/signup/SignUpForm";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-slate-50">
      <div className="w-full max-w-[400px] py-2 flex flex-col items-center">
        <SignUpForm />
      </div>
    </div>
  );
}
