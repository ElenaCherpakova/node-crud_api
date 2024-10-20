import { IncomingMessage, ServerResponse } from 'http';
import { HttpStatusCode } from './httpStatus.interface.ts';

export const sendResponse = (
  res: ServerResponse,
  statusCode: HttpStatusCode,
  data: object | string,
) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
};
