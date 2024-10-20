import { IncomingMessage, ServerResponse } from 'http';
import { getAllUsers, getUserById } from './users.service.ts';
import { sendResponse } from './helper/responses.ts';
import { HttpStatusCode } from './types/http-status.interface.ts';
import { validate as isUuid } from 'uuid';

export const userRoutes = async (
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> => {
  try {
    const { url, method } = req;
    if (url === '/api/users' && method === 'GET') {
      const users = await getAllUsers();
      return sendResponse(res, HttpStatusCode.OK, users);
    }
    if (url?.startsWith('/api/users/') && method === 'GET') {
      const userId = url.split('/')[3];
      if (!isUuid(userId)) {
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
    return sendResponse(res, HttpStatusCode.NOT_FOUND, {
      message: 'Route not found',
    });
  } catch (error) {
    return sendResponse(res, HttpStatusCode.INTERNAL_SERVER, {
      message: 'Internal Server Error',
    });
  }
};
