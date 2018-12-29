import { BarbershopManager } from './barbershopProcess';

export function clientRegister(barbershopManager: BarbershopManager, socketServer: SocketIO.Server, manager: StateManager): Function {
  return function (socket: SocketIO.Socket): void {
    socket.on('client', (message) => {
      barbershopManager.writeToBarbershop(message);
    });

    socket.on('change-state', (message) => {
      manager.dispatch(message);
      socket.emit(manager.getState());
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

export interface StateManager {
  dispatch: Function;
  getState: Function;
}

export interface Store {
  barbers: Barber[];
  customers: Customer[];
}

export interface Person {
  name: string;
  state: string;
  [key: string]: string | null;
}

export interface Barber extends Person {
  client: string | null;
}

export interface Customer extends Person {
}

interface BaseEvent {
  emitter: string;
  state: string;
  name: string;
}
interface CustomerEvent extends BaseEvent {
}

interface BarberEvent extends BaseEvent {
  customer_name?: string;
}

export function initializeState(): StateManager {
  const state: Store = {
    barbers: [],
    customers: [],
  };

  function dispatch(event: BarberEvent | CustomerEvent) {
    if (event.state === 'restart') {
      state.barbers = [];
      state.customers = [];
    }
  
    if (event.state === 'served') {
      state.customers = customerReducer(state.customers, {emitter: 'customer', state: 'served', name: event.customer_name });
    }
    switch(event.emitter) {
      case 'barber':
        state.barbers = barberReducer(state.barbers, event);
        break;
      case 'customer':
        state.customers = customerReducer(state.customers, event);
        break;
    }
  }

  function getState() : Store{
    return Object.assign({}, state);
  }
  return {
    dispatch,
    getState,
  };
}

function initializeBarber(name: string, state: string, client=null): Barber {
  return {
    name,
    state,
    client
  };
}

function barberReducer(currentState: Store['barbers'], event: BarberEvent): Barber[] {
  let newState: Barber[];
  switch(event.state) {
    case 'start':
      newState = currentState.slice();
      newState.push(initializeBarber(event.name, event.state));
      break;
    default: 
      newState = currentState.map(barber => {
        if (barber.name === event.name ) {
          return getNewBarberState(barber, event);
        }
        return barber;
      });
  }
  return newState;
};

function customerReducer(currentState: Store['customers'], event: CustomerEvent): Customer[] {
  let newState: Customer[];
  switch(event.state) {
    case 'enter':
      newState = currentState.slice();
      newState.push({
        name: event.name,
        state: event.state,
      });
      break;
    case 'delete':
      newState = currentState.filter(customer => customer.name !== event.name);
      break;
    default:
      newState = currentState.map(customer => {
        if (customer.name === event.name ) {
          return getNewCustomerSate(customer, event);
        }
        return customer;
      });
  }
  return newState;
};

function getNewCustomerSate(currentState: Customer, event: CustomerEvent): Customer {
  return Object.assign({}, currentState, {
    state: event.state,
  });
}

function getNewBarberState(currentState: Barber, event: BarberEvent): Barber {
    return Object.assign({}, currentState, {
      state: event.state,
      client: event.state === 'serving' ? event.customer_name : null,
    });
}
