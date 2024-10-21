import { v4 } from 'uuid';
import { IUser, UserDto } from '../types/user.iterface';
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
  users,
} from '../service/user.service';

describe('User service', () => {
  let mockUser: IUser;
  let mockUserId: string;

  beforeEach(() => {
    mockUser = {
      id: v4(),
      username: 'MockUser',
      age: 20,
      hobbies: ['MockHobby'],
    };
    users.length = 0;
    users.push(mockUser);
    mockUserId = mockUser.id;
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const result = await getAllUsers();
      expect(result.length).toBe(1);
      expect(result[0]).toEqual(mockUser);
    });
  });
  describe('getUserById', () => {
    it('should return a user by id', async () => {
      const result = await getUserById(mockUserId);
      expect(result).toEqual(mockUser);
    });
    it('should return null if no user is found', async () => {
      const id = v4();
      const result = await getUserById(id);
      expect(result).toBeUndefined();
    });
  });
  describe('createUser', () => {
    it('should create a new user', async () => {
      const newMockUser: UserDto = {
        username: 'NewMockUser',
        age: 30,
        hobbies: ['NewMockHobby'],
      };
      const result = await createUser(newMockUser);
      expect(result.username).toBe(newMockUser.username);
      expect(result.age).toBe(newMockUser.age);
      expect(result.hobbies).toEqual(newMockUser.hobbies);
      const allUsers = await getAllUsers();
      expect(allUsers.length).toBe(2);
    });
  });
  describe('updateUser', () => {
    it('should update a user', async () => {
      const updatedUser: Partial<UserDto> = {
        username: 'UpdatedMockUser',
        age: 25,
        hobbies: ['UpdatedMockHobby'],
      };
      const result = await updateUser(mockUserId, updatedUser);
      expect(result?.username).toBe(updatedUser.username);
      expect(result?.age).toBe(updatedUser.age);
      expect(result?.hobbies).toEqual(updatedUser.hobbies);
    });
    it('should return null if no user is found', async () => {
      const id = v4();
      const updatedUser: Partial<UserDto> = {
        username: 'UpdatedMockUser',
        age: 25,
        hobbies: ['UpdatedMockHobby'],
      };
      const result = await updateUser(id, updatedUser);
      expect(result).toBeNull();
    });
  });
  describe('deleteUser', () => {
    it('should delete a user', async () => {
      await deleteUser(mockUserId);
      const allUsers = await getAllUsers();
      expect(allUsers.length).toBe(0);
    });
    it('should return null if no user is found', async () => {
      const id = v4();
      const result = await deleteUser(id);
      expect(result).toBeNull();
    });
  });
});
