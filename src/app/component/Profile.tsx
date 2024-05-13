"use server";
import { getTotalNumberOfPhotos } from "@/service/gallery/photos";

export const Profile = async () => {
  return (
    <div className="flex items-center">
      <div className="w-16 h-16 rounded-full overflow-hidden">
        <img src="/images/profile.jpg" alt="Profile" className="w-full h-full object-cover" />
      </div>
      <div className="ml-4">
        <h1 className="text-xl font-bold">Boonyarith P.</h1>
        <p className="text-gray-500">Software developer, home cooking.</p>
        <p className="text-gray-500">{await getTotalNumberOfPhotos()} photos</p>
      </div>
    </div>
  );
};
