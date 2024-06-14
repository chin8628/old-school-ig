import { PhotoGrid } from "@/app/component/PhotoGrid";
import { Profile } from "@/app/component/Profile";

type UserPageProps = {
  params: {
    username: string;
  };
};

export default async function UserPage(props: UserPageProps) {
  const username = props.params.username;

  return (
    <div>
      <main className="flex min-h-screen flex-col items-center p-0 py-4 sm:py-16 sm:px-[20vw]">
        <div className="max-w-[904px] w-full">
          <div className="p-4 sm:p-8 flex flex-row justify-between items-center w-full">
            <Profile username={username} />
          </div>
          <PhotoGrid username={username} />
        </div>
      </main>
    </div>
  );
}
