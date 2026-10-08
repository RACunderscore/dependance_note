import { injectable, inject } from "tsyringe";
import { Music } from "../domain/music";
import { Day, DAY_ID_MAP } from "../domain/day";
import { MusicRepositoryPort } from "../ports/driven/musicRepositoryPort";

// Mappage des index de new Date().getDay() (0 = Dimanche, 1 = Lundi, etc.) vers l'enum Day
const DAYS_BY_INDEX: Record<number, Day> = {
    0: Day.DIMANCHE,
    1: Day.LUNDI,
    2: Day.MARDI,
    3: Day.MERCREDI,
    4: Day.JEUDI,
    5: Day.VENDREDI,
    6: Day.SAMEDI,
};

@injectable()
export class DefaultMusicService {
    constructor(
        @inject("MusicDefaultRepo")
        private readonly defaultRepo: MusicRepositoryPort
    ) {}

    async getMusic(): Promise<Music | null> {
        // 1. Récupérer l'index du jour actuel (0 = Dimanche ... 6 = Samedi)
        const currentDayIndex = new Date().getDay();
        
        // 2. Convertir l'index vers l'enum Day (ex: Day.MARDI)
        const dayKey = DAYS_BY_INDEX[currentDayIndex];

        // 3. Obtenir le pseudo-ID correspondant au jour
        const defaultDayId = DAY_ID_MAP[dayKey];

        // 4. Récupérer la musique depuis le dépôt par défaut
        return await this.defaultRepo.find(defaultDayId);
    }
}