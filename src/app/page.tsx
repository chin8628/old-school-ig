"use client";
import Image from "next/image";
import { PhotoModal } from "./component/PhotoModal";
import { useState } from "react";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <div>
      <main className="flex min-h-screen flex-col items-center justify-between p-0 sm:p-24">
        <div className="grid grid-cols-3 gap-2 sm:max-w-[925px] w-full mx-auto">
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
      </main>
      {showModal && <PhotoModal close={closeModal} />}
    </div>
  );
}
