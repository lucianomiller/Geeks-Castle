import * as admin from 'firebase-admin';

let initialized = false;

export const initializeFirebaseAdmin = (): admin.firestore.Firestore => {
  if (!initialized) {
    admin.initializeApp();
    initialized = true;
    console.log('✅ Firebase initialized');
  }

  return admin.firestore();
};