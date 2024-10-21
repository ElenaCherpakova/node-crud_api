import { ServerResponse } from 'http';
import { HttpStatusCode } from './types/http-status.interface';

export const sendResponse = (
  res: ServerResponse,
  statusCode: HttpStatusCode,
  data: object | string,
) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
};
