import { v4 } from 'uuid';
import { users } from './users/usersData.ts';
import { IUser, UserDto } from './users/user.iterface.ts';

export const getAllUsers = async (): Promise<IUser[]> => users;

export const getUserById = async (id: string): Promise<IUser | undefined> => {
  return users.find((user) => user.id === id);
};
export const createUser = async (newUser: UserDto): Promise<IUser> => {
  const id = v4();
  const createUser = { ...newUser, id };
  users.push(createUser);
  return createUser;
};
