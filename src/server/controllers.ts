import { ChildProcess } from "child_process";

export default function listenOnClient(barbershop: ChildProcess) {
  return function (socket: SocketIO.Socket) {
    socket.on('client', (message) => {
      barbershop.stdin.write(`${message}\n`, 'utf-8');
    });
  }
}