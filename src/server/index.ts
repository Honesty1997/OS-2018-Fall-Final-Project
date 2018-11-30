import { spawn } from 'child_process';
import http from 'http';

import app from './app';
import io from 'socket.io';

const config = require('config');
const port = config.get('server.port');
const host = config.get('server.host');
const server = http.createServer(app);
const ioOptions = {
  serveClient: false,
  path: '/channel',
};
const ioServer = new io(server, ioOptions);

let barbershop: ChildProcess;
server.listen({
  port,
  host,
}, () => {
  console.log(`Server is listening on port ${host}://${port}`)
  barbershop = spawn('python3', ['main.py']);
  barbershop.stdout.on('data', (chunk) => {
    const data = chunk.toString();
    ioServer.sockets.emit('message', data);
  });
  barbershop.on('close', (code) => {
    console.log(`Barbershop process exited with code ${code}`);
    console.log('Barbershop is closed T_T.');
  });
});
server.on('close', () => {
  barbershop.kill('byebye');
});