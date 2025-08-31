import {
  BaseEntity,
  BaseSnapshot,
  EntitySnapshot,
} from 'src/domain/base.entity';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export type UserEntitySnapshot = EntitySnapshot<{
  username: string;
  name: string;
  password: string;
  role: UserRole | keyof typeof UserRole;
}>;

export class UserEntity extends BaseEntity<UserEntitySnapshot> {
  declare username: string;
  declare name: string;
  declare password: string;
  declare role: UserRole;

  protected _snapshot(): Omit<UserEntitySnapshot, keyof BaseSnapshot> {
    return {
      username: this.username,
      name: this.name,
      password: this.password,
      role: this.role,
    };
  }

  protected _set(data: Partial<UserEntitySnapshot> = {}) {
    if (data.username) this.username = data.username.trim();
    if (data.name) this.name = data.name.trim();
    if (data.password) this.password = data.password.trim();
    if (data.role) this.role = UserRole[data.role] || UserRole.USER;
  }
}
