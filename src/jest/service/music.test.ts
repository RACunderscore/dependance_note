import { MusicService } from '../../services/musicService';
import { Music } from '../../domain/music';
import { Weather } from '../../domain/weather';
import { Day } from '../../domain/day';
import { User } from '../../domain/user';

type MockMusicRepository = {
    find: jest.Mock<Promise<Music | null>, [number]>;
};

type MockUserRepository = {
    find: jest.Mock<Promise<User | null>, [number]>;
};

const createMockMusicRepo = (): MockMusicRepository => ({
    find: jest.fn()
});

const createMockUserRepo = (): MockUserRepository => ({
    find: jest.fn()
});

describe('MusicService', () => {
    let musicRepo: MockMusicRepository;
    let userRepo: MockUserRepository;
    let service: MusicService;

    beforeEach(() => {
        musicRepo = createMockMusicRepo();
        userRepo = createMockUserRepo();

        service = new MusicService(
            musicRepo as any,
            userRepo as any
        );
    });

    describe('listMusic', () => {

        it('returns the music chosen by the user for the given day and weather', async () => {
            const music: Music = {
                id: 42,
                title: 'Test Song',
                artist: 'Test Artist',
                album: 'Test Album'
            };

            const user: User = {
                id: 1,
                music_choice: {
                    [Day.LUNDI]: {
                        [Weather.SOLEIL]: 42
                    }
                }
            };

            userRepo.find.mockResolvedValue(user);
            musicRepo.find.mockResolvedValue(music);

            const result = await service.listMusic(
                1,
                Day.LUNDI,
                Weather.SOLEIL
            );

            expect(result).toEqual(music);

            expect(userRepo.find).toHaveBeenCalledTimes(1);
            expect(userRepo.find).toHaveBeenCalledWith(1);

            expect(musicRepo.find).toHaveBeenCalledTimes(1);
            expect(musicRepo.find).toHaveBeenCalledWith(42);
        });

        it('uses the default day music when the user has no choice for the weather', async () => {
            const music: Music = {
                id: -1,
                title: 'Monday Default',
                artist: 'Test Artist',
                album: 'Test Album'
            };

            const user: User = {
                id: 1,
                music_choice: {
                    [Day.LUNDI]: {}
                }
            };

            userRepo.find.mockResolvedValue(user);
            musicRepo.find.mockResolvedValue(music);

            const result = await service.listMusic(
                1,
                Day.LUNDI,
                Weather.PLUIE
            );

            expect(result).toEqual(music);

            expect(musicRepo.find).toHaveBeenCalledTimes(1);
            expect(musicRepo.find).toHaveBeenCalledWith(-1);
        });

        it('uses the default day music when the user does not exist', async () => {
            const music: Music = {
                id: -3,
                title: 'Wednesday Default',
                artist: 'Test Artist',
                album: 'Test Album'
            };

            userRepo.find.mockResolvedValue(null);
            musicRepo.find.mockResolvedValue(music);

            const result = await service.listMusic(
                1,
                Day.MERCREDI,
                Weather.NEIGE
            );

            expect(result).toEqual(music);

            expect(userRepo.find).toHaveBeenCalledWith(1);
            expect(musicRepo.find).toHaveBeenCalledTimes(1);
            expect(musicRepo.find).toHaveBeenCalledWith(-3);
        });

        it('uses the default day music when the weather choice is null', async () => {
            const music: Music = {
                id: -5,
                title: 'Friday Default',
                artist: 'Test Artist',
                album: 'Test Album'
            };

            const user: User = {
                id: 1,
                music_choice: {
                    [Day.VENDREDI]: {
                        [Weather.NUAGEUX]: null
                    }
                }
            };

            userRepo.find.mockResolvedValue(user);
            musicRepo.find.mockResolvedValue(music);

            const result = await service.listMusic(
                1,
                Day.VENDREDI,
                Weather.NUAGEUX
            );

            expect(result).toEqual(music);

            expect(musicRepo.find).toHaveBeenCalledWith(-5);
        });

        it('throws an error when the day is invalid', async () => {
            await expect(
                service.listMusic(
                    1,
                    'invalid-day',
                    Weather.SOLEIL
                )
            ).rejects.toThrow('Jour invalide: invalid-day');

            expect(userRepo.find).not.toHaveBeenCalled();
            expect(musicRepo.find).not.toHaveBeenCalled();
        });

        it('throws an error when the weather is invalid', async () => {
            await expect(
                service.listMusic(
                    1,
                    Day.LUNDI,
                    'invalid-weather'
                )
            ).rejects.toThrow('Météo invalide: invalid-weather');

            expect(userRepo.find).not.toHaveBeenCalled();
            expect(musicRepo.find).not.toHaveBeenCalled();
        });

        it('accepts lowercase day and weather values', async () => {
            const music: Music = {
                id: 42,
                title: 'Test Song',
                artist: 'Test Artist',
                album: 'Test Album'
            };

            const user: User = {
                id: 1,
                music_choice: {
                    [Day.LUNDI]: {
                        [Weather.SOLEIL]: 42
                    }
                }
            };

            userRepo.find.mockResolvedValue(user);
            musicRepo.find.mockResolvedValue(music);

            const result = await service.listMusic(
                1,
                'lundi',
                'soleil'
            );

            expect(result).toEqual(music);
            expect(musicRepo.find).toHaveBeenCalledWith(42);
        });

        it('returns null when the music repository does not find the music', async () => {
            const user: User = {
                id: 1,
                music_choice: {
                    [Day.MARDI]: {
                        [Weather.PLUIE]: 100
                    }
                }
            };

            userRepo.find.mockResolvedValue(user);
            musicRepo.find.mockResolvedValue(null);

            const result = await service.listMusic(
                1,
                Day.MARDI,
                Weather.PLUIE
            );

            expect(result).toBeNull();

            expect(musicRepo.find).toHaveBeenCalledWith(100);
        });

        it('uses the correct default ID for each day', async () => {
            const testCases = [
                { day: Day.LUNDI, expectedId: -1 },
                { day: Day.MARDI, expectedId: -2 },
                { day: Day.MERCREDI, expectedId: -3 },
                { day: Day.JEUDI, expectedId: -4 },
                { day: Day.VENDREDI, expectedId: -5 },
                { day: Day.SAMEDI, expectedId: -6 },
                { day: Day.DIMANCHE, expectedId: -7 }
            ];

            for (const { day, expectedId } of testCases) {
                userRepo.find.mockResolvedValue(null);
                musicRepo.find.mockResolvedValue(null);

                await service.listMusic(
                    1,
                    day,
                    Weather.SOLEIL
                );

                expect(musicRepo.find).toHaveBeenCalledWith(expectedId);
            }
        });
    });
});