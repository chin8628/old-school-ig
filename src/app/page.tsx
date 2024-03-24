"use client";
import Image from "next/image";
import { PhotoModal } from "./component/PhotoModal";
import { useState } from "react";
import { Profile } from "./component/Profile";
import { PhotoItem } from "./component/PhotoItem";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <div>
      <main className="flex min-h-screen flex-col items-center p-0 py-8 sm:py-16 sm:px-[20vw]">
        <div className="max-w-[920px]">
          <div className="p-4 sm:p-8">
            <Profile />
          </div>
          <div className="grid grid-cols-3 gap-2 w-full mx-auto">
            {[...Array(7)].map((_, i) => (
              <PhotoItem key={i} src={`/images/1.jpg`} openModal={openModal} priority={i < 3} />
            ))}
          </div>
        </div>
      </main>
      {showModal && <PhotoModal close={closeModal} />}
    </div>
  );
}
