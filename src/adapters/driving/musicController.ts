import { Express, Request, Response } from "express";
import { inject, injectable, delay } from "tsyringe";
import { MusicServiceFactory } from "../../factories/musicServiceFactory";
import { NotificationFacade } from "../../facades/notification";

@injectable()
export class MusicController {
    constructor(
        @inject(delay(() => MusicServiceFactory))
        private readonly musicServiceFactory: MusicServiceFactory,

        @inject(delay(() => NotificationFacade))
        private readonly notificationFacade: NotificationFacade
    ) {}

    registerRoutes(app: Express): void {
        app.get(
            "/music/:id/:day/:weather",
            this.getMusicFromUser.bind(this)
        );
    }

    async getMusicFromUser(
        req: Request,
        res: Response
    ): Promise<Response | void> {
        try {
            const { id, day, weather } = req.params;

            // 1. Validation des paramètres
            const userId = Number(id);

            if (isNaN(userId)) {
                throw new Error(
                    "L'identifiant utilisateur doit être un nombre valide."
                );
            }

            if (
                !day ||
                typeof day !== "string" ||
                !weather ||
                typeof weather !== "string"
            ) {
                throw new Error(
                    "Les paramètres jour et météo doivent être renseignés."
                );
            }

            // 2. Récupération de la musique
            const musicService = this.musicServiceFactory.getMusicService();

            const music = await musicService.listMusic(
                userId,
                day,
                weather
            );

            if (!music) {
                throw new Error(
                    "Aucune musique trouvée pour ces critères."
                );
            }

            // 3. Notification par Email + SMS
            await this.notificationFacade.send(music);

            // 4. Réponse HTTP
            return res.status(200).json(music);

        } catch (error) {
            console.warn(
                "[MusicController] Erreur rencontrée, basculement vers DefaultMusicService via la Factory :",
                error
            );

            try {
                const defaultService =
                    this.musicServiceFactory.getDefaultService();

                const defaultMusic = await defaultService.getMusic();

                if (!defaultMusic) {
                    return res.status(404).json({
                        error: "Musique par défaut introuvable."
                    });
                }

                return res.status(200).json(defaultMusic);

            } catch (fallbackError) {
                console.error(
                    "[MusicController] Échec de la récupération de la musique par défaut :",
                    fallbackError
                );

                return res.status(500).json({
                    error: "Impossible de récupérer la musique demandée ni la musique par défaut."
                });
            }
        }
    }
}