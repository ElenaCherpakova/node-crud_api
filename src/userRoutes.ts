import { IncomingMessage, ServerResponse } from 'http';
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from './user.service.ts';
import { sendResponse } from './helper/responses.ts';
import { HttpStatusCode } from './types/http-status.interface.ts';
import { validate } from 'uuid';
import { parseRequestBody } from './helper/parseReqBody.ts';
import { UserDto } from './types/user.iterface.ts';

export const userRoutes = async (
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> => {
  try {
    const { url, method } = req;
    if (url === '/api/users') {
      if (method === 'GET') {
        const users = await getAllUsers();
        return sendResponse(res, HttpStatusCode.OK, users);
      }
      if (method === 'POST') {
        const newUser: UserDto = await parseRequestBody(req);
        if (
          !newUser.username ||
          typeof newUser.username !== 'string' ||
          !newUser.age ||
          typeof newUser.age !== 'number' ||
          !newUser.hobbies ||
          !Array.isArray(newUser.hobbies)
        ) {
          return sendResponse(res, HttpStatusCode.BAD_REQUEST, {
            message: 'Invalid user data',
          });
        }
        const user = await createUser(newUser);
        return sendResponse(res, HttpStatusCode.CREATED, user);
      }
      return sendResponse(res, HttpStatusCode.METHOD_NOT_ALLOWED, {
        message: 'Method not allowed',
      });
    }
    if (url?.startsWith('/api/users/')) {
      const userId = url.split('/')[3];
      if (method === 'GET') {
        if (!validate(userId)) {
          return sendResponse(res, HttpStatusCode.BAD_REQUEST, {
            message: 'Invalid user id',
          });
        }
        const user = await getUserById(userId);
        if (!user) {
          return sendResponse(res, HttpStatusCode.NOT_FOUND, {
            message: 'User not found',
          });
        }
        return sendResponse(res, HttpStatusCode.OK, user);
      }
      if (method === 'PUT') {
        if (!validate(userId)) {
          return sendResponse(res, HttpStatusCode.BAD_REQUEST, {
            message: 'Invalid user id',
          });
        }
        const user = await getUserById(userId);
        if (!user) {
          return sendResponse(res, HttpStatusCode.NOT_FOUND, {
            message: 'User not found',
          });
        }
        const userToUpdate: UserDto = await parseRequestBody(req);
        if (
          !userToUpdate.username ||
          typeof userToUpdate.username !== 'string' ||
          !userToUpdate.age ||
          typeof userToUpdate.age !== 'number' ||
          !userToUpdate.hobbies ||
          !Array.isArray(userToUpdate.hobbies)
        ) {
          return sendResponse(res, HttpStatusCode.BAD_REQUEST, {
            message: 'Invalid user data',
          });
        }
        const updatedUser = await updateUser(userId, userToUpdate);
        if (!updatedUser) {
          return sendResponse(res, HttpStatusCode.INTERNAL_SERVER, {
            message: 'Failed to update user',
          });
        }
        return sendResponse(res, HttpStatusCode.OK, updatedUser);
      }
      if (method === 'DELETE') {
        if (!validate(userId)) {
          return sendResponse(res, HttpStatusCode.BAD_REQUEST, {
            message: 'Invalid user id',
          });
        }
        const user = await getUserById(userId);
        if (!user) {
          return sendResponse(res, HttpStatusCode.NOT_FOUND, {
            message: 'User not found',
          });
        }
        await deleteUser(userId);
        res.writeHead(HttpStatusCode.NO_CONTENT);
        res.end();
        return;
      }
      return sendResponse(res, HttpStatusCode.METHOD_NOT_ALLOWED, {
        message: 'Method not allowed',
      });
    }
    return sendResponse(res, HttpStatusCode.NOT_FOUND, {
      message: 'Route not found',
    });
  } catch (error) {
    return sendResponse(res, HttpStatusCode.INTERNAL_SERVER, {
      message: 'Internal Server Error',
    });
  }
};
