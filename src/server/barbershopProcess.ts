import { ChildProcess, spawn } from "child_process";
import { StateManager } from './controllers';

interface BarbershopManagerState {
  barbershop: ChildProcess | null;
  barberNum: number;
  seatNum: number;
}
export interface BarbershopManager {
  startBarbershop: (socketServer: SocketIO.Server, manager: StateManager) => void;
  getBarbershop: () => ChildProcess;
  killBarbershop: () => void;
  writeToBarbershop: (message: string) => void;
  config: (key: 'barberNum' | 'seatNum', num: number) => void;
}

export function barbershopManager(): BarbershopManager {
  const state: BarbershopManagerState = {
    barbershop: null,
    barberNum: 4,
    seatNum: 5,
  };

  function config(key: 'barberNum' | 'seatNum', num: number): void {
    state[key] = num;
  }

  function startBarbershop(socketServer: SocketIO.Server, manager: StateManager): void {
    state.barbershop = spawn('python3', ['main.py', '-bn', `${state.barberNum}`, '-s', `${state.seatNum}`]);
    attachChildProcessListener(state.barbershop, socketServer, manager);
  }

  function getBarbershop(): ChildProcess {
    if (state.barbershop) {
      return state.barbershop;
    }
    throw new Error('Barbershop process is not running.');
  }
  function killBarbershop(): void {
    if (state.barbershop) {
      const message = { type: 'leave' };
      state.barbershop.kill('SIGTERM');
      state.barbershop.stdin.write(`${JSON.stringify(message)}`, 'utf-8');
      return;
    }
    throw new Error('Barbershop process is not running.');
  }
  function writeToBarbershop(message: string): void {
    if (state.barbershop) {
      state.barbershop.stdin.write(`${JSON.stringify(message)}\n`, 'utf-8');
      return;
    }
    throw new Error('Barbershop process is not running.');
  }

  return {
    getBarbershop,
    startBarbershop,
    killBarbershop,
    writeToBarbershop,
    config
  };
}

export function attachChildProcessListener(barbershop: ChildProcess, ioServer: SocketIO.Server, manager: StateManager) {
  barbershop.on('close', (code) => {
    console.log(`Barbershop process exited with code ${code}`);
  });

  barbershop.stdout.on('data', (chunk) => {
    const data: string[] = chunk.toString().split('\n');
    // The incoming string usaully split by '\n'.
    const splitData = data.filter(ele => ele !== '');
    splitData.forEach(message => {
      let deserializeData = JSON.parse(message);
      manager.dispatch(deserializeData);
      ioServer.sockets.emit('message', manager.getState());
    });
  });
}
