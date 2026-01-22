export interface IPasswordGenerator {
  generateSecurePassword(length?: number): Promise<string>;
  hashPassword(password: string): Promise<string>;
}

export const PASSWORD_GENERATOR = 'PASSWORD_GENERATOR';