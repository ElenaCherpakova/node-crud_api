import request from 'supertest';
import * as http from 'http';
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
import { handleRequest } from '../index';

let server: http.Server;
beforeAll((done) => {
  server = http.createServer(handleRequest);
  server.listen(done);
});

afterAll((done) => {
  server.close(done);
});
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

  describe('Unit test: getAllUsers', () => {
    it('should return all users', async () => {
      const result = await getAllUsers();
      expect(result.length).toBe(1);
      expect(result[0]).toEqual(mockUser);
    });
  });

  describe('API test: Get all users', () => {
    it('should return all users on the path api/users', async () => {
      const response = await request(server).get('/api/users');
      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThanOrEqual(0);
    });
  });
  describe('Unit test: getUserById', () => {
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
  describe('API test: Get user by ID', () => {
    it('should return a user by id on the path api/users/:id', async () => {
      const response = await request(server).get(`/api/users/${mockUserId}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
    });
    it('should return 404 if no user is found', async () => {
      const id = v4();
      const response = await request(server).get(`/api/users/${id}`);
      expect(response.status).toBe(404);
    });
  });
  describe('Unit test: Create User', () => {
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
  describe('API test: Create User', () => {
    it('should create a new user on the path api/users', async () => {
      const newUser: UserDto = {
        username: 'NewMockUser',
        age: 30,
        hobbies: ['NewMockHobby'],
      };
      const response = await request(server).post('/api/users').send(newUser);
      expect(response.status).toBe(201);
      expect(response.body.username).toBe(newUser.username);
      expect(response.body.age).toBe(newUser.age);
      expect(response.body.hobbies).toEqual(newUser.hobbies);
    });
    it('should return 400 if user data is invalid', async () => {
      const newUser = {
        username: 'NewMockUser',
        age: 30,
        hobbies: 'NewMockHobby',
      };
      const response = await request(server).post('/api/users').send(newUser);
      expect(response.status).toBe(400);
    });
  });
  describe('Unit test: Update User', () => {
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
  describe('API test: Update user', () => {
    it('should update a user on the path api/users/:id', async () => {
      const updatedUser: Partial<UserDto> = {
        username: 'UpdatedMockUser',
        age: 25,
        hobbies: ['UpdatedMockHobby'],
      };
      const response = await request(server)
        .put(`/api/users/${mockUserId}`)
        .send(updatedUser);
      expect(response.status).toBe(200);
      expect(response.body.username).toBe(updatedUser.username);
      expect(response.body.age).toBe(updatedUser.age);
      expect(response.body.hobbies).toEqual(updatedUser.hobbies);
    });
    it('should return 400 if user data is invalid', async () => {
      const updatedUser = {
        username: 'UpdatedMockUser',
        age: 25,
        hobbies: 'UpdatedMockHobby',
      };
      const response = await request(server)
        .put(`/api/users/${mockUserId}`)
        .send(updatedUser);
      expect(response.status).toBe(400);
    });
    it('should return 404 if no user is found', async () => {
      const id = v4();
      const updatedUser: Partial<UserDto> = {
        username: 'UpdatedMockUser',
        age: 25,
        hobbies: ['UpdatedMockHobby'],
      };
      const response = await request(server)
        .put(`/api/users/${id}`)
        .send(updatedUser);
      expect(response.status).toBe(404);
    });
  });
  describe('Unit test: Delete User', () => {
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
  describe('API Test: Delete User', () => {
    it('should delete a user on the path api/users/:id', async () => {
      const response = await request(server).delete(`/api/users/${mockUserId}`);
      expect(response.status).toBe(204);
      const allUsers = await getAllUsers();
      expect(allUsers.length).toBe(0);
    });
    it('should return 404 if no user is found', async () => {
      const id = v4();
      const response = await request(server).delete(`/api/users/${id}`);
      expect(response.status).toBe(404);
    });
  });
});
