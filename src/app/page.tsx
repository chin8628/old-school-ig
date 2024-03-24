"use client";
import Image from "next/image";
import { PhotoModal } from "./component/PhotoModal";
import { useState } from "react";
import { Profile } from "./component/Profile";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <div>
      <main className="flex min-h-screen flex-col items-center p-0 py-8 sm:py-32 sm:px-[20vw]">
        <div className="max-w-[920px]">
          <div className="p-4 sm:p-8">
            <Profile />
          </div>
          <div className="grid grid-cols-3 gap-2 w-full mx-auto">
            {[...Array(7)].map((_, i) => (
              <button onClick={openModal} className="w-full h-full max-w-300px max-h-300px" key={i}>
                <Image
                  src={`/images/1.jpg`}
                  alt={`Photo ${i + 1}`}
                  width={0}
                  height={0}
                  sizes="300px"
                  className="object-cover h-auto w-full aspect-square"
                  priority={i < 3}
                />
              </button>
            ))}
          </div>
        </div>
      </main>
      {showModal && <PhotoModal close={closeModal} />}
    </div>
  );
}
