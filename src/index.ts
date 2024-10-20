import * as dotenv from 'dotenv';
import { userRoutes } from './userRoutes.ts';
import { createServer, IncomingMessage, ServerResponse } from 'http';
dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

const server = createServer(
  async (req: IncomingMessage, res: ServerResponse) => {
    await userRoutes(req, res);
  },
);
const PORT: number = parseInt(process.env.PORT as string, 10) || 3000;

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
