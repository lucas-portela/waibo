import { BaseSnapshot } from 'src/domain/base.entity';
import { UserEntity, UserEntitySnapshot } from '../entities/user.entity';

export type UserUpdate = Partial<Omit<UserEntitySnapshot, keyof BaseSnapshot>>;
export type UserCreate = Omit<UserEntitySnapshot, keyof BaseSnapshot>;

export interface UserRepository {
  findById(id: string): Promise<UserEntity | null>;
  findByUsername(username: string): Promise<UserEntity | null>;
  findAll(): Promise<UserEntity[]>;
  create(user: UserCreate): Promise<UserEntity>;
  update(id: string, user: UserUpdate): Promise<UserEntity>;
  delete(id: string): Promise<void>;
}
