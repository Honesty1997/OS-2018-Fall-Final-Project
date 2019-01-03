import { BarbershopManager } from './barbershopProcess';

export function clientRegister(barbershopManager: BarbershopManager, socketServer: SocketIO.Server, manager: StateManager): Function {
  return function (socket: SocketIO.Socket): void {
    socket.on('client', (message) => {
      barbershopManager.writeToBarbershop(message);
    });

    socket.on('change-state', (message) => {
      manager.dispatch(message);
      socket.emit('message', manager.getState());
    });

    socket.on('clear', () => {
      barbershopManager.killBarbershop();
      manager.dispatch({ emitter: 'process', state: 'restart', name: 'none' });
      socketServer.sockets.emit('message', manager.getState());
    });

    socket.on('restart', (message) => {
      barbershopManager.config('seatNum', message['seatNum']);
      barbershopManager.config('barberNum', message['barberNum']);
      socketServer.sockets.emit('message', manager.getState());
      barbershopManager.startBarbershop(socketServer, manager);
    });
  }
}
