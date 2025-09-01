import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
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
import type { QueueService } from 'src/application/queue/ports/queue.service';
import { QUEUE_SERVICE } from 'src/application/queue/tokens';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(
    @Inject(QUEUE_SERVICE)
    private readonly queueService: QueueService,
    private readonly userService: UserService,
  ) {}

  @Post()
  @AdminOnly()
  @ApiOperation({ summary: 'Create a new user (admin only)' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserResponseDto,
  })
  async create(@Body() createUserDto: CreateUserRequestDto) {
    return this.userService.createUser(createUserDto);
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
    return this.userService.findAll();
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: UserResponseDto,
  })
  async getProfile(@Request() req: AuthenticatedRequestDto) {
    return this.userService.findById(req.user.id);
  }

  @Put('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully',
    type: UserResponseDto,
  })
  async updateProfile(
    @Body() updateUserDto: UpdateUserRequestDto,
    @Request() req: AuthenticatedRequestDto,
  ) {
    return this.userService.update(req.user.id, updateUserDto);
  }

  @Delete('me')
  @ApiOperation({ summary: 'Delete current user account' })
  @ApiResponse({
    status: 204,
    description: 'User account deleted successfully',
  })
  async deleteProfile(@Request() req: AuthenticatedRequestDto) {
    await this.userService.delete(req.user.id);
  }

  @Delete(':id')
  @AdminOnly()
  @ApiOperation({ summary: 'Delete any user account (admin only)' })
  @ApiResponse({
    status: 204,
    description: 'User account deleted successfully',
  })
  async deleteUser(@Param('id') id: string) {
    await this.userService.delete(id);
  }
}
