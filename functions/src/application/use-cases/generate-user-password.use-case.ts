import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { IPasswordGenerator } from '../../domain/services/password-generator.interface';

export interface GeneratePasswordResult {
  success: boolean;
  plainPassword?: string;
  hashedPassword?: string;
  error?: string;
}

export class GenerateUserPasswordUseCase {
  constructor(
    private readonly passwordGenerator: IPasswordGenerator,
    private readonly userRepository: IUserRepository
    ) {}

  async execute(userId: string, plainPassword: string): Promise<GeneratePasswordResult> {
    try {
      const user = await this.userRepository.findById(userId);
      
      if (!user) {
        console.error(`❌ [UseCase] User not found: ${userId}`);
        return {
          success: false,
          error: 'User not found',
        };
      }
      
      if (!plainPassword) {
        console.log(`🔐 Generating password for user: ${userId}`);

        plainPassword = await this.passwordGenerator.generateSecurePassword();
        user.passwordGenerated = true;
        console.log(`✅ Secure password generated: ${plainPassword.substring(0, 3)}***`);
      }

      const hashedPassword = await this.passwordGenerator.hashPassword(plainPassword);
      console.log(`✅ Password hashed successfully`);

      user.password = hashedPassword;
      await this.userRepository.update(user);

      console.log(`✅ User document updated`);

      return {
        success: true,
        plainPassword,
        hashedPassword,
      };
    } catch (error) {
      console.error(`❌ Error in GenerateUserPasswordUseCase:`, error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        error: errorMessage,
      };
    }
  }
}