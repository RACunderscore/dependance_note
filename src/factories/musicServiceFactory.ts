import { injectable, inject, delay } from "tsyringe";
import { MusicService } from "../services/musicService";
import { DefaultMusicService } from "../services/defaultMusicService";

@injectable()
export class MusicServiceFactory {
    constructor(
        @inject(delay(() => MusicService))
        private readonly musicService: MusicService,
        @inject(delay(() => DefaultMusicService))
        private readonly defaultService: DefaultMusicService
    ) {}

    /**
     * Renvoie le service iTunes si un ID valide existe,
     * sinon renvoie le service de musique par défaut.
     */
    getMusicService(): MusicService {
        return this.musicService;
    }

    getDefaultService(): DefaultMusicService {
        return this.defaultService;
    }
}