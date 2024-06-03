import { SignInForm } from "@/app/signin/SignInForm";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

type SignInProps = {
  searchParams: {
    error: string;
  };
};

export default async function SignIn(props: SignInProps) {
  const session = await getServerSession();

  if (session) {
    redirect("/");
  }

  return (
    <div className="flex items-center justify-center h-screen bg-slate-50">
      <div className="w-full max-w-[400px] py-2 flex flex-col items-center">
        <h1 className="mb-8 text-3xl font-semibold text-center">Sign in</h1>
        <SignInForm error={props.searchParams.error} />
        <div className="mt-4 text-sm text-center">
          <Link href="/signup">Create a new account?</Link>
        </div>
      </div>
    </div>
  );
}
