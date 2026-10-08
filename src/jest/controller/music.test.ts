import "reflect-metadata";

import { Request, Response } from "express";

import { MusicController } from "../../adapters/driving/musicController";
import { MusicServiceFactory } from "../../factories/musicServiceFactory";
import { NotificationFacade } from "../../facades/notification";
import { MusicService } from "../../services/musicService";
import { DefaultMusicService } from "../../services/defaultMusicService";
import { Music } from "../../domain/music";

type MockMusicService = {
    listMusic: jest.Mock;
};

type MockDefaultMusicService = {
    getMusic: jest.Mock;
};

type MockMusicServiceFactory = {
    getMusicService: jest.Mock;
    getDefaultService: jest.Mock;
};

type MockNotificationFacade = {
    send: jest.Mock;
};

type MockResponse = {
    status: jest.Mock;
    json: jest.Mock;
};

const createMockMusicService = (): MockMusicService => ({
    listMusic: jest.fn()
});

const createMockDefaultMusicService = (): MockDefaultMusicService => ({
    getMusic: jest.fn()
});

const createMockFactory = (): MockMusicServiceFactory => ({
    getMusicService: jest.fn(),
    getDefaultService: jest.fn()
});

const createMockNotificationFacade = (): MockNotificationFacade => ({
    send: jest.fn().mockResolvedValue(undefined)
});

const createMockResponse = (): MockResponse => {
    const res: MockResponse = {
        status: jest.fn(),
        json: jest.fn()
    };

    res.status.mockReturnValue(res);

    return res;
};

describe("MusicController", () => {
    let controller: MusicController;

    let factory: MockMusicServiceFactory;
    let musicService: MockMusicService;
    let defaultService: MockDefaultMusicService;
    let notificationFacade: MockNotificationFacade;

    beforeEach(() => {
        jest.clearAllMocks();

        factory = createMockFactory();
        musicService = createMockMusicService();
        defaultService = createMockDefaultMusicService();
        notificationFacade = createMockNotificationFacade();

        factory.getMusicService.mockReturnValue(musicService);
        factory.getDefaultService.mockReturnValue(defaultService);

        controller = new MusicController(
            factory as unknown as MusicServiceFactory,
            notificationFacade as unknown as NotificationFacade
        );
    });

    beforeAll(() => {
        jest.spyOn(console, 'warn').mockImplementation(() => {});
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    describe("getMusicFromUser", () => {

        it("returns music with status 200 when the request is valid", async () => {
            const music: Music = {
                id: 1,
                title: "Test Music",
                artist: "Test Artist",
                album: "Test Album"
            };

            musicService.listMusic.mockResolvedValue(music);

            const req = {
                params: {
                    id: "1",
                    day: "LUNDI",
                    weather: "SOLEIL"
                }
            } as unknown as Request;

            const res = createMockResponse();

            await controller.getMusicFromUser(req, res as unknown as Response);

            expect(musicService.listMusic).toHaveBeenCalledTimes(1);
            expect(musicService.listMusic).toHaveBeenCalledWith(
                1,
                "LUNDI",
                "SOLEIL"
            );

            expect(notificationFacade.send).toHaveBeenCalledTimes(1);
            expect(notificationFacade.send).toHaveBeenCalledWith(music);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(music);
        });

        it("converts the user id from string to number", async () => {
            const music: Music = {
                id: 1,
                title: "Test Music",
                artist: "Test Artist",
                album: "Test Album"
            };

            musicService.listMusic.mockResolvedValue(music);

            const req = {
                params: {
                    id: "42",
                    day: "LUNDI",
                    weather: "SOLEIL"
                }
            } as unknown as Request;

            const res = createMockResponse();

            await controller.getMusicFromUser(req, res as unknown as Response);

            expect(musicService.listMusic).toHaveBeenCalledWith(
                42,
                "LUNDI",
                "SOLEIL"
            );

            expect(notificationFacade.send).toHaveBeenCalledWith(music);
        });

        it("calls the notification facade with the returned music", async () => {
            const music: Music = {
                id: 10,
                title: "My Song",
                artist: "My Artist",
                album: "My Album"
            };

            musicService.listMusic.mockResolvedValue(music);

            const req = {
                params: {
                    id: "1",
                    day: "MARDI",
                    weather: "PLUIE"
                }
            } as unknown as Request;

            const res = createMockResponse();

            await controller.getMusicFromUser(req, res as unknown as Response);

            expect(notificationFacade.send).toHaveBeenCalledTimes(1);
            expect(notificationFacade.send).toHaveBeenCalledWith(music);
        });

        it("uses the default service when the user id is invalid", async () => {
            const defaultMusic: Music = {
                id: -1,
                title: "Default Music",
                artist: "Default Artist",
                album: "Default Album"
            };

            defaultService.getMusic.mockResolvedValue(defaultMusic);

            const req = {
                params: {
                    id: "abc",
                    day: "LUNDI",
                    weather: "SOLEIL"
                }
            } as unknown as Request;

            const res = createMockResponse();

            await controller.getMusicFromUser(req, res as unknown as Response);

            expect(musicService.listMusic).not.toHaveBeenCalled();

            expect(defaultService.getMusic).toHaveBeenCalledTimes(1);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(defaultMusic);
        });

        it("uses the default service when the day is missing", async () => {
            const defaultMusic: Music = {
                id: -1,
                title: "Default Music",
                artist: "Default Artist",
                album: "Default Album"
            };

            defaultService.getMusic.mockResolvedValue(defaultMusic);

            const req = {
                params: {
                    id: "1",
                    day: "",
                    weather: "SOLEIL"
                }
            } as unknown as Request;

            const res = createMockResponse();

            await controller.getMusicFromUser(req, res as unknown as Response);

            expect(musicService.listMusic).not.toHaveBeenCalled();
            expect(defaultService.getMusic).toHaveBeenCalledTimes(1);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(defaultMusic);
        });

        it("uses the default service when the weather is missing", async () => {
            const defaultMusic: Music = {
                id: -1,
                title: "Default Music",
                artist: "Default Artist",
                album: "Default Album"
            };

            defaultService.getMusic.mockResolvedValue(defaultMusic);

            const req = {
                params: {
                    id: "1",
                    day: "LUNDI",
                    weather: ""
                }
            } as unknown as Request;

            const res = createMockResponse();

            await controller.getMusicFromUser(req, res as unknown as Response);

            expect(musicService.listMusic).not.toHaveBeenCalled();
            expect(defaultService.getMusic).toHaveBeenCalledTimes(1);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(defaultMusic);
        });

        it("uses the default service when the music service returns null", async () => {
            const defaultMusic: Music = {
                id: -1,
                title: "Default Music",
                artist: "Default Artist",
                album: "Default Album"
            };

            musicService.listMusic.mockResolvedValue(null);
            defaultService.getMusic.mockResolvedValue(defaultMusic);

            const req = {
                params: {
                    id: "1",
                    day: "LUNDI",
                    weather: "SOLEIL"
                }
            } as unknown as Request;

            const res = createMockResponse();

            await controller.getMusicFromUser(req, res as unknown as Response);

            expect(musicService.listMusic).toHaveBeenCalledTimes(1);
            expect(notificationFacade.send).not.toHaveBeenCalled();

            expect(defaultService.getMusic).toHaveBeenCalledTimes(1);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(defaultMusic);
        });

        it("uses the default service when the music service throws an error", async () => {
            const defaultMusic: Music = {
                id: -1,
                title: "Default Music",
                artist: "Default Artist",
                album: "Default Album"
            };

            musicService.listMusic.mockRejectedValue(
                new Error("Music service error")
            );

            defaultService.getMusic.mockResolvedValue(defaultMusic);

            const req = {
                params: {
                    id: "1",
                    day: "LUNDI",
                    weather: "SOLEIL"
                }
            } as unknown as Request;

            const res = createMockResponse();

            await controller.getMusicFromUser(req, res as unknown as Response);

            expect(musicService.listMusic).toHaveBeenCalledTimes(1);
            expect(notificationFacade.send).not.toHaveBeenCalled();

            expect(defaultService.getMusic).toHaveBeenCalledTimes(1);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(defaultMusic);
        });

        it("returns 404 when the default service returns null", async () => {
            musicService.listMusic.mockResolvedValue(null);
            defaultService.getMusic.mockResolvedValue(null);

            const req = {
                params: {
                    id: "1",
                    day: "LUNDI",
                    weather: "SOLEIL"
                }
            } as unknown as Request;

            const res = createMockResponse();

            await controller.getMusicFromUser(req, res as unknown as Response);

            expect(defaultService.getMusic).toHaveBeenCalledTimes(1);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                error: "Musique par défaut introuvable."
            });
        });

        it("returns 500 when both the main service and default service fail", async () => {
            musicService.listMusic.mockRejectedValue(
                new Error("Music service error")
            );

            defaultService.getMusic.mockRejectedValue(
                new Error("Default service error")
            );

            const req = {
                params: {
                    id: "1",
                    day: "LUNDI",
                    weather: "SOLEIL"
                }
            } as unknown as Request;

            const res = createMockResponse();

            await controller.getMusicFromUser(req, res as unknown as Response);

            expect(musicService.listMusic).toHaveBeenCalledTimes(1);
            expect(defaultService.getMusic).toHaveBeenCalledTimes(1);

            expect(notificationFacade.send).not.toHaveBeenCalled();

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: "Impossible de récupérer la musique demandée ni la musique par défaut."
            });
        });

        it("does not call the notification facade when the default music is used", async () => {
            const defaultMusic: Music = {
                id: -1,
                title: "Default Music",
                artist: "Default Artist",
                album: "Default Album"
            };

            musicService.listMusic.mockResolvedValue(null);
            defaultService.getMusic.mockResolvedValue(defaultMusic);

            const req = {
                params: {
                    id: "1",
                    day: "LUNDI",
                    weather: "SOLEIL"
                }
            } as unknown as Request;

            const res = createMockResponse();

            await controller.getMusicFromUser(req, res as unknown as Response);

            expect(notificationFacade.send).not.toHaveBeenCalled();

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(defaultMusic);
        });
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });
});