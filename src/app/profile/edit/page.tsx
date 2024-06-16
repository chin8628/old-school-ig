"use server";
import { ProfileSection } from "@/app/profile/edit/ProfileSection";
import { getProfileInfoByUsername } from "@/service/profile";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/signin");
  }

  const profile = await getProfileInfoByUsername(session.user?.name as string);
  if (!profile) {
    redirect("/signin");
  }

  return (
    <div className="flex flex-col items-start md:items-center justify-start h-screen bg-slate-50 p-0 py-8 sm:py-16 sm:px-[20vw] px-4">
      <div className="mb-8">
        <Link href="/">Home</Link>
      </div>
      <div className="w-full max-w-[420px]">
        <ProfileSection profile={profile} />
      </div>
    </div>
  );
}
