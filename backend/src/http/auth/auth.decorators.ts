import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';

export const IS_PUBLIC_ENDPOINT_KEY = 'isPublic';
export const IS_ADMIN_ONLY_ENDPOINT_KEY = 'isAdminOnly';
export const IS_USER_ONLY_ENDPOINT_KEY = 'isUserOnly';

export const Public = () =>
  applyDecorators(
    SetMetadata(IS_PUBLIC_ENDPOINT_KEY, true),
    ApiSecurity({ public: [] }),
  );
export const AdminOnly = () => SetMetadata(IS_ADMIN_ONLY_ENDPOINT_KEY, true);
export const UserOnly = () => SetMetadata(IS_USER_ONLY_ENDPOINT_KEY, true);
