import { Music } from "../../domain/music";

export interface EmailRepositoryPort {
    send(music: Music): Promise<void>;
}
