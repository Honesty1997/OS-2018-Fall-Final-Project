import { spawn, ChildProcess } from 'child_process';
import http from 'http';

import app from './app';
import Server from 'socket.io';
import config from 'config';
import { listenOnClient, initializeState } from './controllers';

const port: number = config.get('server.port');
const host: string = config.get('server.host');
const server = http.createServer(app);
const ioOptions = {
  serveClient: false,
  path: '/channel',
};
const ioServer: SocketIO.Server = Server(server, ioOptions);

let barbershop: ChildProcess;
const manager = initializeState();

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

  barbershop.stdout.on('data', (chunk) => {
    const data: Array<string> = chunk.toString().split('\n');
    // The incoming string usaully split by '\n'.
    const splitData = data.filter(ele => ele !== '');
    splitData.forEach(message => {
      let deserializeData = JSON.parse(message);
      manager.dispatch(deserializeData);
      ioServer.sockets.emit('message', manager.getState());
    });
  });

  ioServer.on('connection', (socket) => {
    listenOnClient(barbershop, manager)(socket);

    ioServer.sockets.emit('message', manager.getState());
  });

  barbershop.on('close', (code) => {
    console.log(`Barbershop process exited with code ${code}`);
    console.log('Barbershop is closed T_T.');
  });

  // kill the python process when main process exits.
  process.on('SIGINT', () => {
    console.log(`\rKeyboard Interrupt. Program exit.`);
    process.exit();
    barbershop.kill();
  });
  process.on('exit', () => {
    barbershop.kill();
  });
});
server.on('close', () => {
  barbershop.kill('byebye');
});
