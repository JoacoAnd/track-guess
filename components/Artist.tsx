import { SpotifyArtist } from "@/types";
import { useRouter } from "next/navigation";
import React from "react";

const Artist = ({ artist }: { artist: SpotifyArtist }) => {
  const router = useRouter();
  const { id, name, images } = artist;

  const handleClick = () => {
    router.push(`/game?artist=${id}`);
  };
  return (
    <div
      onClick={handleClick}
      className="flex hover:bg-emerald-100 hover:text-black transition-all cursor-pointer gap-6 rounded-md p-2 items-center"
    >
      <img
        width={images[0].width}
        height={images[0].height}
        src={images[0].url}
        alt={name}
        className="w-20 h-20 object-cover"
      />
      {name}
    </div>
  );
};

export default Artist;
