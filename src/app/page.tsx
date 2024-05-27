import { PhotoGrid } from "@/app/component/PhotoGrid";
import { getServerSession } from "next-auth";
import { Profile } from "./component/Profile";
import { GridUploadButton } from "./component/UploadItem";

export default async function Home() {
  const session = await getServerSession();

  return (
    <div>
      <main className="flex min-h-screen flex-col items-center p-0 py-4 sm:py-16 sm:px-[20vw]">
        <div className="max-w-[904px] w-full">
          <div className="p-4 sm:p-8 flex flex-row justify-between items-center w-full">
            <Profile />
            {session && <GridUploadButton />}
          </div>
          <PhotoGrid />
        </div>
      </main>
    </div>
  );
}
