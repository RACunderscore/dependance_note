import { injectable } from "tsyringe";
import { Music } from "../../domain/music";
import { SmsRepositoryPort } from "../../ports/driven/smsRepositoryPort";

@injectable()
export class SmsRepo implements SmsRepositoryPort {

    async send(music: Music): Promise<void> {
        console.log("SMS", music);
    }
}