import { Music } from "../../domain/music";
import { MusicRepositoryPort } from "../../ports/driven/musicRepositoryPort";
import defaultMusic from "../../../default_music.json";
import { injectable } from "tsyringe";

@injectable()
export class MusicDefaultRepo implements MusicRepositoryPort {
    async find(id: number): Promise<Music | null> {
        const musicMap = defaultMusic as Record<string, Music>;
        
        // Find track matching the requested negative ID key
        const track = musicMap[id.toString()];

        if (!track) {
            return null;
        }

        return {
            id: track.id,
            title: track.title,
            artist: track.artist,
            album: track.album,
            previewUrl: track.previewUrl,
            artworkUrl: track.artworkUrl,
            releaseDate: track.releaseDate ? new Date(track.releaseDate) : undefined,
        };
    }
}