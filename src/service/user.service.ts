import { v4 } from 'uuid';
import { IUser, UserDto } from '../types/user.iterface.ts';

export let users: IUser[] = [];

export const getAllUsers = async (): Promise<IUser[]> => users;

export const getUserById = async (id: string): Promise<IUser | undefined> => {
  return users.find((user) => user.id === id);
};
export const createUser = async (newUser: UserDto): Promise<IUser> => {
  const id = v4();
  const createUser = { id, ...newUser };
  users.push(createUser);
  return createUser;
};

export const updateUser = async (
  id: string,
  updateUser: Partial<UserDto>,
): Promise<IUser | null> => {
  const findUserIndex = users.findIndex((user) => user.id === id);
  if (findUserIndex === -1) {
    return null
  }
  const findUser = users[findUserIndex];
  const updatedUser: IUser = { ...findUser, ...updateUser };
  users[findUserIndex] = updatedUser;
  return updatedUser;
};

export const deleteUser = async (id: string): Promise<null | void> => {
    const findUser = users.find((user) => user.id === id);
    if (!findUser) {
      return null
    }
    users = users.filter((user) => user.id !== id);
};
