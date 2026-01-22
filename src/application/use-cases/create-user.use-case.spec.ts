import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { CreateUserUseCase } from './create-user.use-case';
import * as userRepositoryInterface from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/entities/user.entity';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let mockRepository: jest.Mocked<userRepositoryInterface.IUserRepository>;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        {
          provide: userRepositoryInterface.USER_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateUserUseCase>(CreateUserUseCase);
  });

  it('should create a user successfully', async () => {
    const createUserDto = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'SecurePass123!',
    };

    mockRepository.findByEmail.mockResolvedValue(null);
    mockRepository.create.mockImplementation((user: User) =>
      Promise.resolve(user),
    );

    const result = await useCase.execute(createUserDto);

    expect(result).toBeDefined();
    expect(result.username).toBe(createUserDto.username);
    expect(result.email).toBe(createUserDto.email);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockRepository.findByEmail).toHaveBeenCalledWith(
      createUserDto.email,
    );
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockRepository.create).toHaveBeenCalled();
  });

  it('should throw ConflictException if email already exists', async () => {
    const createUserDto = {
      username: 'testuser',
      email: 'existing@example.com',
    };

    const existingUser = new User(
      'existing-id',
      'existinguser',
      'existing@example.com',
      'hashedpass',
    );

    mockRepository.findByEmail.mockResolvedValue(existingUser);

    await expect(useCase.execute(createUserDto)).rejects.toThrow(
      ConflictException,
    );
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockRepository.create).not.toHaveBeenCalled();
  });
});
