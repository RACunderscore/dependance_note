import 'reflect-metadata';
import { container } from '../../config/container';

import { MusicService } from '../../services/musicService';
import { MusicPort } from '../../ports/driving/musicPort';
import { Day } from '../../domain/day';
import { Weather } from '../../domain/weather';

describe('MusicService - Integration Tests', () => {
    let service: MusicPort;

    beforeAll(() => {
        // Resolve the service from the real tsyringe container.
        // This means the real repositories will be injected.
        service = container.resolve(MusicService);
    });

    describe('listMusic', () => {
        it('returns the music configured for user 0 on Monday with sunny weather', async () => {
            const result = await service.listMusic(
                0,
                Day.LUNDI,
                Weather.SOLEIL
            );

            expect(result).not.toBeNull();

            expect(result).toHaveProperty('id');
            expect(result).toHaveProperty('title');
            expect(result).toHaveProperty('artist');
            expect(result).toHaveProperty('album');
        });

        it('uses the default Monday music when no weather choice exists', async () => {
            const result = await service.listMusic(
                0,
                Day.LUNDI,
                Weather.PLUIE
            );

            expect(result).not.toBeNull();

            expect(result?.id).toBe(1440841480);
        });

        it('accepts lowercase day and weather values', async () => {
            const result = await service.listMusic(
                0,
                'lundi',
                'soleil'
            );

            expect(result).not.toBeNull();

            expect(result).toHaveProperty('id');
            expect(result).toHaveProperty('title');
            expect(result).toHaveProperty('artist');
            expect(result).toHaveProperty('album');
        });
    });
});