import { PhotoGrid } from "@/app/component/PhotoGrid";
import { Profile } from "@/app/component/Profile";
import { GridUploadButton } from "@/app/component/UploadItem";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession();
  if (!session?.user?.name) {
    redirect("/signin");
  }

  return (
    <div>
      <main className="flex min-h-screen flex-col items-center p-0 py-4 sm:py-16 sm:px-[20vw]">
        <div className="max-w-[904px] w-full">
          <div className="p-4 sm:p-8 flex flex-row justify-between items-center w-full">
            <Profile username={session.user.name} />
            {session && <GridUploadButton />}
          </div>
          <PhotoGrid username={session.user.name} />
        </div>
      </main>
    </div>
  );
}
