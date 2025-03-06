"use client";

import React, { useState } from "react";
import { WavyBackground } from "@/components/ui/wavy-background";
import { Input } from "@/components/ui/input";
import { useDebounceCallback } from "usehooks-ts";
import { SpotifyArtist } from "@/types";
import Artist from "@/components/Artist";

export default function Home() {
  const [artists, setArtists] = useState<SpotifyArtist[]>([]);

  const onChange = useDebounceCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.value.trim() === "") {
        setArtists([]);
        return;
      }

      const getArtists = async () => {
        const res = await fetch(
          `/api/getArtist?value=${encodeURIComponent(e.target.value)}`
        );
        const data = await res.json();
        setArtists(data.searchData.artists.items);
      };

      getArtists();
    },
    300
  );

  return (
    <WavyBackground backgroundFill="#191A1C" colors={["#00D3BC", "#1E2C3B"]}>
      <div className="w-screen h-screen flex flex-col items-center justify-center">
        <div className="text-white w-[90vw] border border-gray-50 shadow-2xl max-w-xl gap-4 bg-gradient-to-r from-emerald-500 to-lime-600 rounded-md flex flex-col px-[5%] py-10 items-center justify-center">
          <h1 className="text-4xl font-bold drop-shadow-xl">
            Track<span className="text-lime-400">Guess</span>
          </h1>
          <p className="text-lg text-center">
            ¿Cuántas canciones de tu artista favorito eres capaz de nombrar?
          </p>
          <div className="relative w-full">
            <Input
              onChange={onChange}
              type="text"
              placeholder="Ingresa un artista..."
              className="w-full text-white"
            />
            {artists.length > 0 && (
              <div className="bg-emerald-900 absolute top-[120%] left-0 w-full z-10 rounded-md shadow-lg">
                {artists.map((artist) => (
                  <Artist artist={artist} key={artist.id} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </WavyBackground>
  );
}
