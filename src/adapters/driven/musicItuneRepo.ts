import { Music } from "../../domain/music";
import { MusicRepositoryPort } from "../../ports/driven/musicRepositoryPort";
import { injectable } from "tsyringe";


// Raw response structure from iTunes API
interface ITunesTrackResult {
    trackId: number;
    trackName: string;
    artistName: string;
    collectionName: string;
    previewUrl?: string;
    artworkUrl100?: string;
    releaseDate?: string;
}

interface ITunesResponse {
    resultCount: number;
    results: ITunesTrackResult[];
}

@injectable()
export class MusicItuneRepo implements MusicRepositoryPort {
    private readonly baseUrl = "https://itunes.apple.com/lookup";

    async find(id: number): Promise<Music | null> {
        const response = await fetch(`${this.baseUrl}?id=${id}&entity=song`);

        if (!response.ok) {
            throw new Error(`iTunes API HTTP error: ${response.status}`);
        }

        const data = (await response.json()) as ITunesResponse;

        if (!data.results || data.results.length === 0) {
            return null;
        }

        const track = data.results[0];

        return {
            id: track.trackId,
            title: track.trackName,
            artist: track.artistName,
            album: track.collectionName,
            previewUrl: track.previewUrl,
            artworkUrl: track.artworkUrl100,
            releaseDate: track.releaseDate ? new Date(track.releaseDate) : undefined,
        };
    }
}