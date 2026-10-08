import 'reflect-metadata';
import { container } from '../../config/container';

import { MusicServiceFactory } from '../../factories/musicServiceFactory';
import { MusicService } from '../../services/musicService';
import { DefaultMusicService } from '../../services/defaultMusicService';

describe('MusicServiceFactory - Integration', () => {

    it('resolves the factory from the container', () => {
        const factory = container.resolve(MusicServiceFactory);

        expect(factory).toBeInstanceOf(MusicServiceFactory);
    });

    it('returns the configured MusicService', () => {
        const factory = container.resolve(MusicServiceFactory);

        const service = factory.getMusicService();

        expect(service).toBeInstanceOf(MusicService);
    });

    it('returns the configured DefaultMusicService', () => {
        const factory = container.resolve(MusicServiceFactory);

        const service = factory.getDefaultService();

        expect(service).toBeInstanceOf(DefaultMusicService);
    });
});