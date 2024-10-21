import * as dotenv from 'dotenv';
import { userRoutes } from './routes/routes.ts';
import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { HttpStatusCode } from './types/http-status.interface.ts';
dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

export const handleRequest = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  try {
    await userRoutes(req, res);
  } catch (error) {
    console.error(error);
    res.writeHead(HttpStatusCode.INTERNAL_SERVER, {
      'Content-Type': 'application/json',
    });
    res.end(JSON.stringify({ message: 'Internal server error' }));
  }
};
if (process.env.NODE_ENV !== 'test') {
  const PORT: number = parseInt(process.env.PORT as string, 10) || 3000;
  const server = createServer(handleRequest);

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });

  server.on('error', (err) => {
    console.log('Server Error', err);
  });
}
