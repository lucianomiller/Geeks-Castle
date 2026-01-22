import { ConflictException, Inject, Injectable } from '@nestjs/common';
import * as userRepositoryInterface from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(userRepositoryInterface.USER_REPOSITORY)
    private readonly userRepository: userRepositoryInterface.IUserRepository,
  ) {}

  async execute(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const user = new User(
      createUserDto.username,
      createUserDto.email,
      createUserDto.password,
    );

    const createdUser = await this.userRepository.create(user);

    return new UserResponseDto({
      id: createdUser.id,
      username: createdUser.username,
      email: createdUser.email,
      createdAt: createdUser.createdAt,
    });
  }
}
