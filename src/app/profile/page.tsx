"use server";
import { ProfileSection } from "@/app/profile/ProfileSection";
import { getProfileInfo } from "@/service/account/profile";
import Link from "next/link";

export default async function ProfilePage() {
  const profile = await getProfileInfo();

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
