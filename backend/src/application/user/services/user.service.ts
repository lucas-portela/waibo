import { Inject, Injectable } from '@nestjs/common';
import type { UserRepository } from 'src/domain/user/repositories/user.repository';
import { USER_REPOSITORY } from '../tokens';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserEntity } from 'src/domain/user/entities/user.entity';
import { DuplicatedUsernameError } from 'src/core/error/duplicated-username.error';
import { AuthService } from 'src/application/auth/services/auth.service';
import { ZodError } from 'zod';
import { InvalidDtoFieldsError } from 'src/core/error/invalid-dto-fields.error';
import { UserDto } from '../dtos/user.dto';

@Injectable()
export class UserService {
  constructor(
    private authService: AuthService,
    @Inject(USER_REPOSITORY) private userRepository: UserRepository,
  ) {}

  async findById(id: string) {
    const user = await this.userRepository.findById(id);
    return user ? UserDto.parse(user) : null;
  }

  async findByUsername(username: string) {
    const user = await this.userRepository.findByUsername(username);
    return user ? UserDto.parse(user) : null;
  }

  async createUser(data: CreateUserDto) {
    try {
      data = CreateUserDto.parse(data);
    } catch (err) {
      if (err instanceof ZodError) {
        throw new InvalidDtoFieldsError(err.issues);
      }
      throw err;
    }

    const existingUser = await this.userRepository.findByUsername(
      data.username,
    );
    if (existingUser) {
      throw new DuplicatedUsernameError('Username already exists');
    }

    const user = new UserEntity({
      ...data,
      password: await this.authService.hashPassword(data.password),
    });

    return await this.userRepository.create(user);
  }
}
