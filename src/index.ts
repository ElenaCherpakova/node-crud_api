import * as dotenv from 'dotenv';
import { userRoutes } from './routes/routes.ts';
import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { HttpStatusCode } from './types/http-status.interface.ts';
dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

const server = createServer(
  async (req: IncomingMessage, res: ServerResponse) => {
    try {
      await userRoutes(req, res);
    } catch (error) {
      console.error(error);
      res.writeHead(HttpStatusCode.INTERNAL_SERVER, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Internal server error' }));
    }
  },
);
const PORT: number = parseInt(process.env.PORT as string, 10) || 3000;

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

server.on('error', (err) => {
  console.log('Server Error', err);
});
