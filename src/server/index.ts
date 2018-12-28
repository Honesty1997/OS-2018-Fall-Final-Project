import { spawn, ChildProcess } from 'child_process';
import http from 'http';
import config from 'config';

import app from './app';
import IOServer  from './socketServer';
import { clientRegister, initializeState } from './controllers';
import { barbershopManager as shopManager } from './barbershopProcess';

const port: number = config.get('server.port');
const host: string = config.get('server.host');
const server = http.createServer(app);
const ioServer = IOServer(server);

let barbershop: ChildProcess;

const stateManager = initializeState();
const barbershopManager = shopManager();

server.listen({
  port,
  host,
}, () => {
  console.log(`Starting development server at ${host}:${port}`);
  try {
    // Make sure your python version is 3.X. If python3 is not found in your path, 
    // just use python.
    barbershop = spawn('python3', ['main.py']);
  } catch {
    barbershop = spawn('python', ['main.py']);
  }
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
    barbershop.kill('SIGTERM');
  });
  process.on('exit', () => {
    barbershop.kill('SIGTERM');
  });
});
server.on('close', () => {
  barbershop.kill('SIGTERM');
});
