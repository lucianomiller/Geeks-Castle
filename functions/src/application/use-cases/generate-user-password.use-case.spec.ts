import { UserEntity } from "../../domain/entities/user.entity";
import { IUserRepository } from "../../domain/repositories/user.repository.interface";
import { IPasswordGenerator } from "../../domain/services/password-generator.interface";
import { GenerateUserPasswordUseCase } from "./generate-user-password.use-case";

describe('GenerateUserPasswordUseCase', () => {
  let useCase: GenerateUserPasswordUseCase;
  let mockPasswordGenerator: jest.Mocked<IPasswordGenerator>;

  let mockUserRepository: jest.Mocked<IUserRepository>;


  beforeEach(() => {
    mockPasswordGenerator = {
      generateSecurePassword: jest.fn(),
      hashPassword: jest.fn(),
    };

    mockUserRepository = {
      findById: jest.fn(),
      update: jest.fn(),
    };

    useCase = new GenerateUserPasswordUseCase(
      mockPasswordGenerator,
      mockUserRepository,
    );
  });

  it('should generate and save password for user without password', async () => {
    const userId = 'test-user-123';
    const user = new UserEntity(
      userId,
      'testuser',
      'test@example.com',
      null,
      new Date(),
      new Date(),
      false,
    );

    const plainPassword = 'GeneratedPass123!';
    const hashedPassword = '$2b$10$hashedpassword';

    mockUserRepository.findById.mockResolvedValue(user);
    mockPasswordGenerator.generateSecurePassword.mockResolvedValue(plainPassword);
    mockPasswordGenerator.hashPassword.mockResolvedValue(hashedPassword);
    mockUserRepository.update.mockResolvedValue(undefined);

    const result = await useCase.execute(userId, '');

    expect(result.success).toBe(true);
    expect(result.plainPassword).toBe(plainPassword);
    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    expect(mockPasswordGenerator.generateSecurePassword).toHaveBeenCalled();
    expect(mockPasswordGenerator.hashPassword).toHaveBeenCalledWith(plainPassword);
    expect(mockUserRepository.update).toHaveBeenCalled();
  });

  it('should not generate password if user already has one', async () => {
    const userId = 'test-user-123';
    const user = new UserEntity(
      userId,
      'testuser',
      'test@example.com',
      '$2b$10$existingpassword',
      new Date(),
      new Date(),
      false,
    );

    mockUserRepository.findById.mockResolvedValue(user);

    const result = await useCase.execute(userId, user.password!);

    expect(result.success).toBe(true);
    expect(mockPasswordGenerator.generateSecurePassword).not.toHaveBeenCalled();
    expect(mockUserRepository.update).toHaveBeenCalled();
  });

  it('should return error if user not found', async () => {
    const userId = 'non-existent';

    mockUserRepository.findById.mockResolvedValue(null);

    const result = await useCase.execute(userId, '');

    expect(result.success).toBe(false);
    expect(result.error).toBe('User not found');
  });

  it('should handle repository errors', async () => {
    const userId = 'test-user-123';
    const error = new Error('Repository error');

    mockUserRepository.findById.mockRejectedValue(error);

    const result = await useCase.execute(userId, '');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Repository error');
  });
});