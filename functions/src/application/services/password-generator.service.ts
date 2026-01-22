import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { IPasswordGenerator } from '../../domain/services/password-generator.interface';

export class PasswordGeneratorService implements IPasswordGenerator {
  private readonly SALT_ROUNDS = 10;
  private readonly DEFAULT_LENGTH = 16;

  async generateSecurePassword(length: number = this.DEFAULT_LENGTH): Promise<string> {
    const charset = 
      'abcdefghijklmnopqrstuvwxyz' +
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
      '0123456789' +
      '!@#$%^&*()_+-=[]{}|;:,.<>?';

    const randomBytesBuffer = randomBytes(length);
    let password = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = randomBytesBuffer[i] % charset.length;
      password += charset[randomIndex];
    }

    return password;
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }
}