import { Album } from "@/types";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const artistId = url.searchParams.get("artist");
  if (!artistId) return NextResponse.json({ error: "artist is required" }, { status: 400 });

  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString("base64"),
    },
    body: "grant_type=client_credentials",
  });

  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;

  const albumsRes = await fetch(`https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album&limit=50&market=ES`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const albumsData = await albumsRes.json();
  const albums: Album[] = [];

  for (const album of albumsData.items) {
    const tracksRes = await fetch(`https://api.spotify.com/v1/albums/${album.id}/tracks`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const tracksData = await tracksRes.json();
    albums.push({
      id: album.id,
      name: album.name,
      image: album.images[0]?.url || "",
      songs: tracksData.items.map((t: any) => t.name),
    });
  }

  albums.reverse();

  return NextResponse.json({ albums });
}
