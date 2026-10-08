import { injectable, inject } from 'tsyringe';
import { Music } from '../domain/music';
import { Weather } from '../domain/weather';
import { Day, DAY_ID_MAP } from '../domain/day';
import { MusicPort } from '../ports/driving/musicPort';
import { UserRepositoryPort } from '../ports/driven/userRepositoryPort';
import { MusicRepositoryPort } from '../ports/driven/musicRepositoryPort';

@injectable()
export class MusicService implements MusicPort {

    constructor(
        @inject('MusicRepositoryPort')
        private readonly musicRepo: MusicRepositoryPort,
        @inject('UserRepositoryPort')
        private readonly userRepo: UserRepositoryPort
    ) {}

    async listMusic(user_id: number, day: string, weather: string): Promise<Music | null> {
        // 1. Validation des enums
        const upperDay = day.toUpperCase() as Day;
        if (!Object.values(Day).includes(upperDay)) {
            throw new Error(`Jour invalide: ${day}`);
        }

        const upperWeather = weather.toUpperCase() as Weather;
        if (!Object.values(Weather).includes(upperWeather)) {
            throw new Error(`Météo invalide: ${weather}`);
        }

        // 2. Récupération de l'utilisateur
        const user = await this.userRepo.find(user_id);

        let dayChoices = undefined;

        if(user)
            dayChoices = user.music_choice[upperDay];

        let targetId = dayChoices ? dayChoices[upperWeather] : null;

        if (targetId === null || targetId === undefined) {
            targetId = DAY_ID_MAP[upperDay];
        }

        return await this.musicRepo.find(targetId);
    }
}