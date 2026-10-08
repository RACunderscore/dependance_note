import { injectable } from "tsyringe";
import { Music } from "../../domain/music";
import { EmailRepositoryPort } from "../../ports/driven/emailRepositoryPort";

@injectable()
export class EmailRepo implements EmailRepositoryPort {

    async send(music: Music): Promise<void> {
        console.log("EMAIL", music);
    }
}