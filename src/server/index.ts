import { spawn, ChildProcess } from 'child_process';
import http from 'http';

import app from './app';
import Server from 'socket.io';
import config from 'config';
import listenClient from './controllers';

const port: number = config.get('server.port');
const host: string = config.get('server.host');
const server = http.createServer(app);
const ioOptions = {
  serveClient: false,
  path: '/channel',
};
const ioServer: SocketIO.Server = Server(server, ioOptions);

let barbershop: ChildProcess;

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
      ioServer.sockets.emit('message', message);
    });
  });

  ioServer.on('connection', listenClient(barbershop));

  barbershop.on('close', (code) => {
    console.log(`Barbershop process exited with code ${code}`);
    console.log('Barbershop is closed T_T.');
  });
});
server.on('close', () => {
  barbershop.kill('byebye');
});
