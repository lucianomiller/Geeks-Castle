import { UserEntity } from '../../../domain/entities/user.entity';

export class UserMapper {
  static toDomain(id: string, data: FirebaseFirestore.DocumentData): UserEntity {
    return new UserEntity(
      id,
      data.username,
      data.email,
      data.password,
      data.createdAt?.toDate() || new Date(),
      data.updatedAt?.toDate() || new Date(),
      data.passwordGenerated || false,
    );
  }

  static toUpdateData(user: UserEntity): Record<string, any> {
    return {
      password: user.password,
      passwordGenerated: user.passwordGenerated,
      updatedAt: new Date(),
    };
  }
}