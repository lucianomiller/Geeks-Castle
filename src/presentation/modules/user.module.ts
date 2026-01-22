import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';
import { UserController } from '../controllers/user.controller';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { FirebaseConfig } from '../../infrastructure/persistence/firebase/firebase.config';
import { UserRepositoryImpl } from '../../infrastructure/persistence/repositories/user.repository.impl';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';

@Module({
  imports: [ConfigModule.forRoot(), EventEmitterModule.forRoot()],
  controllers: [UserController],
  providers: [
    FirebaseConfig,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepositoryImpl,
    },
    CreateUserUseCase,
  ],
})
export class UserModule {}
