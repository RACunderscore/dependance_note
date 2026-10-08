import "reflect-metadata";
import { container } from "tsyringe";
import "dotenv/config";

// Ports
import { MusicRepositoryPort } from "../ports/driven/musicRepositoryPort";
import { UserRepositoryPort } from "../ports/driven/userRepositoryPort";
import { EmailRepositoryPort } from "../ports/driven/emailRepositoryPort";
import { SmsRepositoryPort } from "../ports/driven/smsRepositoryPort";

// Adapters
import { MusicItuneRepo } from "../adapters/driven/musicItuneRepo";
import { MusicDefaultRepo } from "../adapters/driven/musicDefaultRepo";
import { MusicBrainzRepo } from "../adapters/driven/musicBrainzRepo";
import { UserJsonRepo } from "../adapters/driven/userJsonRepo";
import { EmailRepo } from "../adapters/driven/emailRepo";
import { SmsRepo } from "../adapters/driven/smsRepo";

// Services
import { DefaultMusicService } from "../services/defaultMusicService";
import { MusicService } from "../services/musicService";

// Factory
import { MusicServiceFactory } from "../factories/musicServiceFactory";

// Controller
import { MusicController } from "../adapters/driving/musicController";

// Facade
import { NotificationFacade } from "../facades/notification";


// ========================================
// Music repositories
// ========================================

// Default music repository
container.register<MusicRepositoryPort>(
    "MusicDefaultRepo",
    {
        useClass: MusicDefaultRepo
    }
);


// Main music repository
const musicPlayer = process.env.MUSIC_PLAYER;

switch (musicPlayer) {

    case "ITUNES":
        container.register<MusicRepositoryPort>(
            "MusicRepositoryPort",
            {
                useClass: MusicItuneRepo
            }
        );
        break;

    case "MUSICBRAINZ":
        container.register<MusicRepositoryPort>(
            "MusicRepositoryPort",
            {
                useClass: MusicBrainzRepo
            }
        );
        break;

    default:
        throw new Error(
            `Invalid MUSIC_PLAYER value: "${musicPlayer}". ` +
            `Expected "ITUNES" or "MUSICBRAINZ".`
        );
}


// ========================================
// User repository
// ========================================

container.register<UserRepositoryPort>(
    "UserRepositoryPort",
    {
        useClass: UserJsonRepo
    }
);


// ========================================
// Services
// ========================================

container.register(MusicService, {
    useClass: MusicService
});

container.register(DefaultMusicService, {
    useClass: DefaultMusicService
});


// ========================================
// Factory
// ========================================

container.register(MusicServiceFactory, {
    useClass: MusicServiceFactory
});


// ========================================
// Notifications
// ========================================

container.register<EmailRepositoryPort>(
    "EmailRepositoryPort",
    {
        useClass: EmailRepo
    }
);

container.register<SmsRepositoryPort>(
    "SmsRepositoryPort",
    {
        useClass: SmsRepo
    }
);

container.register(NotificationFacade, {
    useClass: NotificationFacade
});


// ========================================
// Controller
// ========================================

container.register(MusicController, {
    useClass: MusicController
});

export { container };