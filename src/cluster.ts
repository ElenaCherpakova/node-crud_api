import cluster from 'cluster';
import { cpus } from 'os';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { userRoutes } from './routes/routes';

const numCPUs = cpus().length;
const PORT: number = parseInt(process.env.PORT as string, 10) || 3000;

if (cluster.isPrimary) {
  console.log(`Primary process is running on pid: ${process.pid}`);

  for (let i = 0; i < numCPUs - 1; i++) {
    const workerPort = PORT + i + 1;
    cluster.fork({ WORKER_PORT: workerPort });
  }

  let currentWorkerIndex = 0;
  const workers = Object.values(cluster.workers ?? {});

  const loadBalancer = (req: IncomingMessage, res: ServerResponse) => {
    currentWorkerIndex = (currentWorkerIndex + 1) % workers.length;
    const worker = workers[currentWorkerIndex];

    if (worker) {
      worker.send({ req: req.url, method: req.method, headers: req.headers });
    }
  };
  createServer((req, res) => {
    loadBalancer(req, res);
  }).listen(PORT, () => {
    console.log(`Load balancer listening on port ${PORT}`);
  });
  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  const WORKER_PORT = process.env.WORKER_PORT;
  createServer((req: IncomingMessage, res: ServerResponse) => {
    userRoutes(req, res);
  }).listen(WORKER_PORT, () => {
    console.log(`Worker ${process.pid} is listening on port ${WORKER_PORT}`);
  });
}
