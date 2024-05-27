"use server";
import { getProfileInfo } from "@/service/account/profile";
import { getTotalNumberOfPhotos } from "@/service/gallery/photos";
import { getServerSession } from "next-auth";
import Link from "next/link";

export const Profile = async () => {
  const profile = await getProfileInfo();
  const session = await getServerSession();

  return (
    <div className="flex items-center">
      <div className="w-16 h-16 rounded-full overflow-hidden">
        <img src="/images/profile.jpg" alt="Profile" className="w-full h-full object-cover" />
      </div>
      <div className="ml-4">
        <div className="flex flex-row items-center space-x-2">
          <h1 className="text-xl font-bold">{profile.displayName}</h1>
          {session !== null && (
            <Link
              className="p-3 py-1 bg-gray-100 text-xs text-neutral-800 hover:bg-gray-200 rounded no-underline"
              href="/profile/edit"
            >
              Edit
            </Link>
          )}
        </div>
        <p className="text-gray-500">{profile.shortBio}</p>
        <p className="text-gray-500">{await getTotalNumberOfPhotos()} photos</p>
      </div>
    </div>
  );
};
