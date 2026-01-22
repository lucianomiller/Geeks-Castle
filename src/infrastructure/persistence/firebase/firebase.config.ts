import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseConfig {
  private firestore: admin.firestore.Firestore;

  constructor() {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    const isEmulator = process.env.NODE_ENV !== 'production';

    if (isEmulator) {
      process.env.FIRESTORE_EMULATOR_HOST =
        process.env.FIRESTORE_EMULATOR_HOST || 'localhost:8080';

      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || 'geeks-castle',
      });
    } else {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
    }

    this.firestore = admin.firestore();

    if (isEmulator) {
      this.firestore.settings({
        host: process.env.FIRESTORE_EMULATOR_HOST || 'localhost:8080',
        ssl: false,
      });
    }
  }

  getFirestore(): admin.firestore.Firestore {
    return this.firestore;
  }
}
