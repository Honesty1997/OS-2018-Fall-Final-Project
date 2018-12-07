import { spawn, ChildProcess } from 'child_process';
import http from 'http';

import app from './app';
import io from 'socket.io';
import config from 'config';

const port: number = config.get('server.port');
const host: string = config.get('server.host');
const server = http.createServer(app);
const ioOptions = {
  serveClient: false,
  path: '/channel',
};
const ioServer = new io(server, ioOptions);

let barbershop: ChildProcess;

function writeToBarbershopProcess(barbershop: ChildProcess) {
  setInterval(
  ()=> {
    barbershop.stdin.write('I have message.', 'utf-8');
    barbershop.stdin.end();
  },
  100);
}

server.listen({
  port,
  host,
}, () => {
  console.log(`Starting development server at ${host}:${port}`);
  barbershop = spawn('python3', ['main.py']);
  barbershop.stdout.on('data', (chunk) => {
    const data: Array<string> = chunk.toString().split('\n');
    const splitData = data.slice(0, data.length - 1);
    splitData.forEach(message => {
      ioServer.sockets.emit('message', message);
    });
  });
  // writeToBarbershopProcess(barbershop);
  barbershop.on('close', (code) => {
    console.log(`Barbershop process exited with code ${code}`);
    console.log('Barbershop is closed T_T.');
  });
});
server.on('close', () => {
  barbershop.kill('byebye');
});
