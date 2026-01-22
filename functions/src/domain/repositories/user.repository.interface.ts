import { UserEntity } from "../entities/user.entity";

export interface IUserRepository {
  findById(userId: string): Promise<UserEntity | null>;
  update(user: UserEntity): Promise<void>;
}

export const USER_REPOSITORY = 'USER_REPOSITORY';