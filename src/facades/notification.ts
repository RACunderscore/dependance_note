import { inject, injectable } from "tsyringe";
import { Music } from "../domain/music";
import { EmailRepositoryPort } from "../ports/driven/emailRepositoryPort";
import { SmsRepositoryPort } from "../ports/driven/smsRepositoryPort";

@injectable()
export class NotificationFacade {

    constructor(
        @inject("EmailRepositoryPort")
        private readonly emailRepo: EmailRepositoryPort,

        @inject("SmsRepositoryPort")
        private readonly smsRepo: SmsRepositoryPort
    ) {}

    async send(music: Music): Promise<void> {
        await this.emailRepo.send(music);
        await this.smsRepo.send(music);
    }
}