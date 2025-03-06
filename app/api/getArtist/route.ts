import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const value = url.searchParams.get("value");
  
  if (!value) return NextResponse.json({ error: "Value is required" }, { status: 400 });

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

  const searchRes = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(value)}&type=artist&limit=3`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });


  const searchData = await searchRes.json();

  return NextResponse.json({ searchData });
}
