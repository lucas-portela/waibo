import { UserDto } from 'src/application/user/dtos/user.dto';

export class AuthenticatedRequestDto {
  user: UserDto;
  isAdmin: boolean;
}
