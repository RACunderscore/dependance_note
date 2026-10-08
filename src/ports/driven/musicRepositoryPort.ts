import { Music } from "../../domain/music";

export interface MusicRepositoryPort {
    find(id: number): Promise<Music | null>;
}
