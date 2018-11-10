/// <reference path="module.ts" />
import { ChildProcess } from 'child_process';

const http = require('http');
const config = require('config');
const { spawn } = require('child_process');

const app = require('./web/server');

const port = config.get('server.port');
const host = config.get('server.host');
const server = http.createServer(app);

let barbershop: ChildProcess;

server.listen({
  port,
  host,
}, () => {
  console.log(`Server is running on ${host}:${port}`);
  barbershop = spawn('python3', ['main.py']);
  barbershop.stdout.on('data', (chunk) => {
    console.log(chunk.toString());
  });
  barbershop.on('close', (code) => {
    console.log(`Barbershop process exited with code ${code}`);
    console.log('Barbershop is closed T_T.');
  });
});

server.on('close', () => {
  barbershop.kill('byebye');
});

console.log(123);

const Philip: MyNameSpace.MyObject = {
  hello: function(){
    console.log(`Hello, ${this.name}`);
  },
  name: 'Philip'
};

Philip.hello();

