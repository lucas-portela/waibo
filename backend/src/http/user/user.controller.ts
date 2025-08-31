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
import { UserService } from 'src/application/user/services/user.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
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
  async create(@Body() createUserDto: CreateUserRequestDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  @AdminOnly()
  @ApiOperation({ summary: 'Get all users (admin only)' })
  async findAll() {
    return this.userService.findAll();
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@Request() req: AuthenticatedRequestDto) {
    return this.userService.findById(req.user.id);
  }

  @Put('me')
  @ApiOperation({ summary: 'Update current user profile' })
  async updateProfile(
    @Body() updateUserDto: UpdateUserRequestDto,
    @Request() req: AuthenticatedRequestDto,
  ) {
    return this.userService.update(req.user.id, updateUserDto);
  }

  @Delete('me')
  @ApiOperation({ summary: 'Delete current user account' })
  async deleteProfile(@Request() req: AuthenticatedRequestDto) {
    await this.userService.delete(req.user.id);
  }

  @Delete(':id')
  @AdminOnly()
  @ApiOperation({ summary: 'Delete any user account (admin only)' })
  async deleteUser(@Param('id') id: string) {
    await this.userService.delete(id);
  }
}
