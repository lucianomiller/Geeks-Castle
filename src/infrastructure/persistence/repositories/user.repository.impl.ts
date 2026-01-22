import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { User } from '../../../domain/entities/user.entity';
import { FirebaseConfig } from '../firebase/firebase.config';

@Injectable()
export class UserRepositoryImpl implements IUserRepository {
  private readonly collectionName = 'users';

  constructor(private readonly firebaseConfig: FirebaseConfig) {}

  async findByEmail(email: string): Promise<User | null> {
    const firestore = this.firebaseConfig.getFirestore();
    const userRef = firestore
      .collection(this.collectionName)
      .where('email', '==', email);
    const snapshot = await userRef.get();
    if (snapshot.empty) {
      return null;
    }
    const doc = snapshot.docs[0];
    const data = doc.data();
    return new User(
      data.id,
      data.username,
      data.email,
      data.password,
      data.createdAt,
      data.updatedAt,
    );
  }

  async create(user: User): Promise<User> {
    const firestore = this.firebaseConfig.getFirestore();
    const userRef = firestore.collection(this.collectionName).doc();

    const userData = {
      id: userRef.id,
      username: user.username,
      email: user.email,
      password: user.password || null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    await userRef.set(userData);
    return new User(
      user.username,
      user.email,
      user.password,
      userRef.id,
      user.createdAt,
      user.updatedAt,
    );
  }
}
