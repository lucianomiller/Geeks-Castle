import * as admin from 'firebase-admin';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserMapper } from '../mappers/user.mapper';

export class FirestoreUserRepository implements IUserRepository {
  private readonly collectionName = 'users';

  constructor(private readonly firestore: admin.firestore.Firestore) {}

  async findById(userId: string): Promise<UserEntity | null> {
    try {
      const userDoc = await this.firestore
        .collection(this.collectionName)
        .doc(userId)
        .get();

      if (!userDoc.exists) {
        console.log(`⚠️ [Repository] User not found in Firestore: ${userId}`);
        return null;
      }

      const user = UserMapper.toDomain(userDoc.id, userDoc.data()!);
      
      return user;
    } catch (error) {
      console.error(`❌ [Repository] Error reading user from Firestore:`, error);
      throw new Error(`Failed to read user: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async update(user: UserEntity): Promise<void> {
    try {
      const userRef = this.firestore
        .collection(this.collectionName)
        .doc(user.id);

      const updateData = UserMapper.toUpdateData(user);

      await userRef.update(updateData);
      
    } catch (error) {
      console.error(`❌ [Repository] Error updating user in Firestore:`, error);
      throw new Error(`Failed to update user: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}