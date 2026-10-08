import "reflect-metadata";
import { container } from "tsyringe";

// Ports
import { MusicRepositoryPort } from "../ports/driven/musicRepositoryPort";
import { UserRepositoryPort } from "../ports/driven/userRepositoryPort";
import { MusicPort } from "../ports/driving/musicPort";
import { EmailRepositoryPort } from "../ports/driven/emailRepositoryPort";
import { SmsRepositoryPort } from "../ports/driven/smsRepositoryPort";

// Adaptateurs (Dépôts)
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

//Facade
import { NotificationFacade } from "../facades/notification";
// Contrôleur
import { MusicController } from "../adapters/driving/musicController";

// 1. Enregistrement des dépôts
container.register<MusicRepositoryPort>("MusicItuneRepo", { useClass: MusicItuneRepo });
container.register<MusicRepositoryPort>("MusicDefaultRepo", { useClass: MusicDefaultRepo });
container.register<MusicRepositoryPort>("MusicBrainzRepo", { useClass: MusicBrainzRepo });
container.register<UserRepositoryPort>("UserRepositoryPort", { useClass: UserJsonRepo });
container.register<MusicRepositoryPort>("MusicRepositoryPort", { useClass: MusicItuneRepo });
container.register<EmailRepositoryPort>("EmailRepositoryPort",{ useClass: EmailRepo });
container.register<SmsRepositoryPort>("SmsRepositoryPort",{ useClass: SmsRepo });

container.register(NotificationFacade, {useClass: NotificationFacade});

// 2. Enregistrement des sous-services
container.register(MusicService, { useClass: MusicService });
container.register(DefaultMusicService, { useClass: DefaultMusicService });

// 3. Enregistrement du service principal de musique
container.register<MusicPort>("MusicService", { useClass: MusicService });

// 4. Enregistrement de la Factory
container.register(MusicServiceFactory, { useClass: MusicServiceFactory });

// 5. Enregistrement du contrôleur
container.register(MusicController, { useClass: MusicController });

export { container };