import { PasswordGeneratorService } from "./password-generator.service";

describe('PasswordGeneratorService', () => {
  let service: PasswordGeneratorService;

  beforeEach(() => {
    service = new PasswordGeneratorService();
  });

  describe('generateSecurePassword', () => {
    it('should generate a password with default length', async () => {
      const password = await service.generateSecurePassword();
      expect(password).toHaveLength(16);
    });

    it('should generate a password with custom length', async () => {
      const password = await service.generateSecurePassword(24);
      expect(password).toHaveLength(24);
    });

    it('should generate different passwords on multiple calls', async () => {
      const password1 = await service.generateSecurePassword();
      const password2 = await service.generateSecurePassword();
      expect(password1).not.toBe(password2);
    });
  });

  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const plainPassword = 'TestPassword123!';
      const hashedPassword = await service.hashPassword(plainPassword);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(plainPassword);
      expect(hashedPassword.length).toBeGreaterThan(0);
    });

    it('should generate different hashes for the same password', async () => {
      const plainPassword = 'TestPassword123!';
      const hash1 = await service.hashPassword(plainPassword);
      const hash2 = await service.hashPassword(plainPassword);

      expect(hash1).not.toBe(hash2);
    });

    it('should create bcrypt hash format', async () => {
      const plainPassword = 'TestPassword123!';
      const hashedPassword = await service.hashPassword(plainPassword);

      // bcrypt hashes start with $2a$, $2b$, or $2y$
      expect(hashedPassword).toMatch(/^\$2[aby]\$/);
    });
  });
});