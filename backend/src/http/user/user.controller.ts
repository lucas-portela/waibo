import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { AdminOnly } from '../auth/auth.decorators';
import { AuthenticatedRequestDto } from '../auth/dtos/authenticated-request.dto';
import { CreateUserRequestDto } from './dtos/create-user-request.dto';
import { UpdateUserRequestDto } from './dtos/update-user-request.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { UserService } from 'src/application/user/services/user.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { UnauthorizedError } from 'src/core/error/unauthorized.error';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @AdminOnly()
  @ApiOperation({ summary: 'Create a new user (admin only)' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserResponseDto,
  })
  async create(@Body() createUserDto: CreateUserRequestDto) {
    const user = await this.userService.createUser(createUserDto);
    return plainToInstance(UserResponseDto, user);
  }

  @Get()
  @AdminOnly()
  @ApiOperation({ summary: 'Get all users (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'All users retrieved successfully',
    type: UserResponseDto,
    isArray: true,
  })
  async findAll() {
    const users = await this.userService.findAll();
    return users.map((user) => plainToInstance(UserResponseDto, user));
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get user profile by ID' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: UserResponseDto,
  })
  async getProfile(
    @Param('userId') userId: string,
    @Request() req: AuthenticatedRequestDto,
  ) {
    await this._checkUserACL(userId, req);
    const user = await this.userService.findById(userId);
    return plainToInstance(UserResponseDto, user);
  }

  @Put(':userId')
  @ApiOperation({ summary: 'Update user profile by ID' })
  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully',
    type: UserResponseDto,
  })
  async updateUser(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserRequestDto,
    @Request() req: AuthenticatedRequestDto,
  ) {
    await this._checkUserACL(userId, req);
    const user = await this.userService.update(userId, updateUserDto);
    return plainToInstance(UserResponseDto, user);
  }

  @Delete(':userId')
  @ApiOperation({ summary: 'Delete user account by ID' })
  @ApiResponse({
    status: 204,
    description: 'User account deleted successfully',
  })
  async deleteUser(
    @Param('userId') userId: string,
    @Request() req: AuthenticatedRequestDto,
  ) {
    await this._checkUserACL(userId, req);
    await this.userService.delete(userId);
  }

  private async _checkUserACL(userId: string, req: AuthenticatedRequestDto) {
    if (!req.isAdmin && req.user.id !== userId)
      throw new UnauthorizedError('You can only access your own resources');
  }
}
