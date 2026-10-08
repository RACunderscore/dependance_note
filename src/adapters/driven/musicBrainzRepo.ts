import { injectable } from "tsyringe";
import { Music } from "../../domain/music";
import { MusicRepositoryPort } from "../../ports/driven/musicRepositoryPort";

@injectable()
export class MusicBrainzRepo implements MusicRepositoryPort {
    private readonly baseUrl = "https://musicbrainz.org/ws/2/recording";

    async find(id: number): Promise<Music | null> {
        try {
            // L'API MusicBrainz nécessite un User-Agent valide dans les en-têtes
            const response = await fetch(
                `${this.baseUrl}?query=recording:${id}&fmt=json`,
                {
                    headers: {
                        "User-Agent": "MusicRetrievalApp/1.0.0 ( contact@example.com )",
                        "Accept": "application/json"
                    }
                }
            );

            if (!response.ok) {
                return null;
            }

            const data = await response.json();
            const recording = data.recordings?.[0];

            if (!recording) {
                return null;
            }

            // Extraction des métadonnées depuis le format JSON de MusicBrainz
            const artistName = recording["artist-credit"]?.[0]?.name ?? "Artiste inconnu";
            const releaseGroup = recording["releases"]?.[0];
            const albumTitle = releaseGroup?.title ?? "Album inconnu";
            const releaseDate = releaseGroup?.date ? new Date(releaseGroup.date) : undefined;

            return {
                id: id,
                title: recording.title ?? "Titre inconnu",
                artist: artistName,
                album: albumTitle,
                releaseDate: releaseDate
            };
        } catch (error) {
            console.error("[MusicBrainzRepo] Erreur lors de la récupération des données :", error);
            return null;
        }
    }
}