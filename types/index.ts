export type Album = {
    id: string;
    name: string;
    image: string;
    songs: string[];
}

export type SpotifyArtist = {
    name: string;
    id: string;
    images: {
        url: string;
        width: number;
        height:number;
    }[];
}