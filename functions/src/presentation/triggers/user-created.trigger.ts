import * as functions from 'firebase-functions';
import { PasswordGeneratorService } from '../../application/services/password-generator.service';
import { GenerateUserPasswordUseCase } from '../../application/use-cases/generate-user-password.use-case';
import { FirestoreUserRepository } from '../../infrastructure/persistence/repositories/firestore-user.repository';
import { initializeFirebaseAdmin } from '../../infrastructure/config/firebase-admin.config';

class UserCreatedTriggerFactory {
    static create() {
        const passwordGenerator = new PasswordGeneratorService();
        const firestore = initializeFirebaseAdmin();
        const userRepository = new FirestoreUserRepository(firestore);
        const useCase = new GenerateUserPasswordUseCase(passwordGenerator, userRepository);
        return useCase;
    }
}

export const onUserCreated = functions.firestore.onDocumentCreated(
    'users/{userId}',
    async (event) => {
        const snapshot = event.data;
        const userId = event.params.userId;

        if (!snapshot) {
            console.error(`❌ No snapshot data available for user: ${userId}`);
            throw new functions.https.HttpsError('internal', 'Snapshot data is undefined');
        }

        const userData = snapshot.data();

        console.log(`🔔 Cloud Function triggered for user: ${userId}`);
        console.log(`📋 User data:`, {
            username: userData.username,
            email: userData.email,
            hasPassword: !!userData.password,
        });

        const useCase = UserCreatedTriggerFactory.create();
        const result = await useCase.execute(userId, userData.password);

        if (result.success) {
            console.log(`✅ Password updated successfully for user: ${userId}`);
        } else {
            console.error(`❌ Password generation failed: ${result.error}`);
            throw new functions.https.HttpsError(
                'internal',
                `Failed to updated password: ${result.error}`,
            );
        }

        return null;
    },
);