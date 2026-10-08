import { Music } from "../../domain/music";

export interface MusicPort {
  	listMusic(user_id: number, day: string, weather: string): Promise<Music | null>;
}
