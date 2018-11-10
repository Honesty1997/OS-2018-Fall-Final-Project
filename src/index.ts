/// <reference path="module.ts" />
import { ChildProcess } from 'child_process';

const http = require('http');
const config = require('config');
const { spawn } = require('child_process');

const app = require('./web/server');

const port = config.get('server.port');
const host = config.get('server.host');
const server = http.createServer(app);

let babershop: ChildProcess;

server.listen({
  port,
  host,
}, () => {
  console.log(`Server is running on ${host}:${port}`);
  babershop = spawn('python3', ['main.py']);
  babershop.stdout.on('data', (chunk) => {
    console.log(chunk.toString());
  });
  babershop.on('close', (code) => {
    console.log(`Babershop process exited with code ${code}`);
    console.log('Babershop is closed T_T.');
  });
});

server.on('close', () => {
  babershop.kill('byebye');
});

console.log(123);

const Philip: MyNameSpace.MyObject = {
  hello: function(){
    console.log(`Hello, ${this.name}`);
  },
  name: 'Philip'
};

Philip.hello();

