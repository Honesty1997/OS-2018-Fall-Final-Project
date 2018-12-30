import http from 'http';
import config from 'config';

import app from './app';
import IOServer  from './socketServer';
import { clientRegister, initializeState } from './controllers';
import { barbershopManager as shopManager } from './barbershopProcess';

const port: number = process.env.NODE_PORT ? parseInt(process.env.NODE_PORT) : config.get('server.port');
const host: string = process.env.NODE_HOST ? process.env.NODE_HOST : config.get('server.host');

const server = http.createServer(app);
const ioServer = IOServer(server);

const stateManager = initializeState();
const barbershopManager = shopManager();

server.listen({
  port,
  host,
}, () => {
  console.log(`Starting development server at ${host}:${port}`);
  // Make sure your python version is 3.X. If python3 is not found in your path, 
  // just use python.
  const clientAddListener = clientRegister(barbershopManager, ioServer, stateManager);
  barbershopManager.startBarbershop(ioServer, stateManager);  
  
  ioServer.on('connection', (socket) => {
    clientAddListener(socket);
    socket.emit('message', stateManager.getState());
  });

  // kill the python process when main process exits.
  process.on('SIGINT', () => {
    console.log(`\rKeyboard Interrupt. Program exit.`);
    process.exit();
    barbershopManager.killBarbershop();
  });
  process.on('exit', () => {
    barbershopManager.killBarbershop();
  });
});
server.on('close', () => {
  barbershopManager.killBarbershop();
});
