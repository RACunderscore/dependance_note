import { User } from "../../domain/user";

export interface UserRepositoryPort {
    find(id: number): Promise<User | null>;
}
