/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Album } from "@/types";
import { Input } from "@/components/ui/input";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";

export default function Game() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const artist = searchParams.get("artist");

  const [albums, setAlbums] = useState<Album[]>([]);
  const [userInput, setUserInput] = useState("");
  const [correctSongs, setCorrectSongs] = useState<{
    [albumId: string]: string[];
  }>({});
  const [timeLeft, setTimeLeft] = useState(60 * 20);
  const [loading, setLoading] = useState(true);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (!artist) router.push("/");
    const fetchAlbumsAndSongs = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/getAlbums?artist=${artist}`);
        const data = await res.json();
        setAlbums(data.albums || []);
      } catch (error) {
        console.error("Error fetching albums:", error);
      }
      setLoading(false);
    };

    fetchAlbumsAndSongs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artist]);

  useEffect(() => {
    if (loading || gameOver) return;

    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else {
      setGameOver(true);
    }
  }, [loading, timeLeft, gameOver]);

  useEffect(() => {
    if (userInput.trim() !== "" && !gameOver) {
      checkAnswer(userInput);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInput]);

  const checkAnswer = (input: string) => {
    const normalizedInput = normalizeText(input);

    for (const album of albums) {
      for (const song of album.songs) {
        const normalizedSong = normalizeText(song);

        if (normalizedSong === normalizedInput) {
          if (!correctSongs[album.id]?.includes(song)) {
            setCorrectSongs((prev) => ({
              ...prev,
              [album.id]: [...(prev[album.id] || []), song],
            }));
          }
          setUserInput("");
        }
      }
    }
  };

  const normalizeText = (text: string) =>
    text
      .toLowerCase()
      .replace(/\s+/g, "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const totalSongs = albums.reduce((acc, album) => acc + album.songs.length, 0);
  const correctAnswers = Object.values(correctSongs).reduce(
    (acc, songs) => acc + songs.length,
    0
  );

  if (loading)
    return (
      <main className="w-full h-screen flex items-center justify-center bg-[#191A1C]">
        <Loader />
      </main>
    );

  if (gameOver) {
    return (
      <main className="w-full h-screen flex items-center justify-center bg-[#191A1C]">
        <div className="text-white w-[90vw] border border-gray-50 shadow-2xl max-w-xl gap-4 bg-gradient-to-r from-emerald-500 to-lime-600 rounded-md flex flex-col px-[5%] py-10 items-center justify-center">
          <h1 className="text-4xl font-bold drop-shadow-xl">Juego terminado</h1>
          <p className="text-xl text-center">
            Has acertado {correctAnswers} de {totalSongs} canciones!
          </p>
          <div className="flex items-center gap-4">
            <Button
              className="cursor-pointer"
              variant="default"
              onClick={() => location.reload()}
            >
              Volver a jugar
            </Button>
            <Button
              className="cursor-pointer"
              variant="secondary"
              onClick={() => router.push("/")}
            >
              Cambiar artista
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <Suspense>
      <main className="w-full min-h-screen bg-[#191A1C]">
        <div className="mx-auto flex flex-col justify-start w-full text-white px-[5%] py-8 gap-8 max-w-7xl">
          <div className="gap-[5%] flex items-end">
            <Input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="text-white"
              placeholder="Ingresa una canción..."
              disabled={loading || gameOver}
            />
            <div className="flex flex-col items-center">
              <span className="font-light text-xs">PUNTAJE</span>
              <p className="font-bold text-2xl">
                {correctAnswers}/{totalSongs}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-light text-xs">TIEMPO</span>
              <p className="font-bold text-2xl">
                {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
                {String(timeLeft % 60).padStart(2, "0")}
              </p>
            </div>
          </div>

          <div className="w-full gap-x-4 gap-y-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {albums.map((album) => (
              <div key={album.id} className="w-full">
                <img
                  src={album.image}
                  alt={album.name}
                  className="w-full h-auto aspect-square object-cover mb-4"
                />
                <ul className="space-y-2">
                  {album.songs.map((cancion, index) => (
                    <li key={index} className="text-base truncate">
                      {index + 1}.{" "}
                      {correctSongs[album.id]?.includes(cancion) && cancion}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </main>
    </Suspense>
  );
}
