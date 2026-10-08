import { MusicServiceFactory } from '../../factories/musicServiceFactory';
import { MusicService } from '../../services/musicService';
import { DefaultMusicService } from '../../services/defaultMusicService';

describe('MusicServiceFactory', () => {
    let factory: MusicServiceFactory;
    let musicService: MusicService;
    let defaultService: DefaultMusicService;

    beforeEach(() => {
        musicService = {} as MusicService;
        defaultService = {} as DefaultMusicService;

        factory = new MusicServiceFactory(
            musicService,
            defaultService
        );
    });

    describe('getMusicService', () => {
        it('returns the injected MusicService', () => {
            const result = factory.getMusicService();

            expect(result).toBe(musicService);
        });
    });

    describe('getDefaultService', () => {
        it('returns the injected DefaultMusicService', () => {
            const result = factory.getDefaultService();

            expect(result).toBe(defaultService);
        });
    });

    describe('services', () => {
        it('returns the correct service for each method', () => {
            expect(factory.getMusicService()).toBe(musicService);
            expect(factory.getDefaultService()).toBe(defaultService);
        });
    });
});