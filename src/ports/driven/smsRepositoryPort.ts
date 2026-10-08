import { Music } from "../../domain/music";

export interface SmsRepositoryPort {
    send(music: Music): Promise<void>;
}
