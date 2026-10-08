import { User } from "../../domain/user";
import { UserRepositoryPort } from "../../ports/driven/userRepositoryPort";
import usersData from "../../../users.json";
import { injectable } from "tsyringe";

@injectable()
export class UserJsonRepo implements UserRepositoryPort {
    async find(id: number): Promise<User | null> {
        const users = usersData as User[];
        const user = users.find((u) => u.id === id);

        return user ?? null;
    }
}