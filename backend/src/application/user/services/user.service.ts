import { forwardRef, Inject, Injectable } from '@nestjs/common';
import type { UserRepository } from 'src/domain/user/repositories/user.repository';
import { USER_REPOSITORY } from '../tokens';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserEntity } from 'src/domain/user/entities/user.entity';
import { DuplicatedUsernameError } from 'src/core/error/duplicated-username.error';
import { UserNotFoundError } from 'src/core/error/user-not-found.error';
import { AuthService } from 'src/application/auth/services/auth.service';
import { ZodError } from 'zod';
import { InvalidDtoFieldsError } from 'src/core/error/invalid-dto-fields.error';
import { UserDto } from '../dtos/user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => AuthService))
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

  async findAll(): Promise<UserDto[]> {
    const users = await this.userRepository.findAll();
    return users.map((user) => UserDto.parse(user));
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

    const user = await this.userRepository.create(
      new UserEntity({
        ...data,
        password: await this.authService.hashPassword(data.password),
      }),
    );

    return UserDto.parse(user);
  }

  async update(id: string, data: UpdateUserDto) {
    try {
      data = UpdateUserDto.parse(data);
    } catch (err) {
      if (err instanceof ZodError) {
        throw new InvalidDtoFieldsError(err.issues);
      }
      throw err;
    }

    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundError(id);
    }

    // Check for username uniqueness if username is being updated
    if (data.username && data.username !== user.username) {
      const existingUser = await this.userRepository.findByUsername(
        data.username,
      );
      if (existingUser) {
        throw new DuplicatedUsernameError('Username already exists');
      }
    }

    const updateData: any = {
      name: data.name,
      username: data.username,
    };

    // Hash password if provided
    if (data.password) {
      updateData.password = await this.authService.hashPassword(data.password);
    }

    const updatedUser = await this.userRepository.update(id, updateData);
    return UserDto.parse(updatedUser);
  }

  async delete(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundError(id);
    }

    await this.userRepository.delete(id);
  }
}
