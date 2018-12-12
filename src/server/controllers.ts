import {
  ChildProcess
} from "child_process";

export function listenOnClient(barbershop: ChildProcess) {
  return function (socket: SocketIO.Socket) {
    socket.on('client', (message) => {
      barbershop.stdin.write(`${message}\n`, 'utf-8');
    });
  }
}

interface StateManager {
  dispatch: Function;
  getState: Function;
}

interface State {
  barbers: Array<Barber>;
  customers: Array<Customer>;
}

interface Barber {
  name: string;
  state: string;
  client: string | null;
}

interface Customer {
  name: string;
  state: string;
}

interface CustomerEvent {
  emitter: string;
  state: string;
  name: string;
}

interface BarberEvent {
  emitter: string;
  state: string;
  name: string;
  customer_name: string;
}

export function initializeState(): StateManager {
  const state: State = {
    barbers: [],
    customers: [],
  };

  function dispatch(event: BarberEvent | CustomerEvent) {
    if (event.state === 'served') {
      state.customers = setCustomerState(state.customers, {emitter: 'customer', state: 'served', name: event.customer_name });
    }
    switch(event.emitter) {
      case 'barber':
        state.barbers = setBarberState(state.barbers, event);
        break;
      case 'customer':
        state.customers = setCustomerState(state.customers, event);
        break;
    }
  }

  function getState() {
    return Object.assign({}, state);
  }
  return {
    dispatch,
    getState,
  };
}

function initializeBarber(name: string, state: string, client=null) {
  return {
    name,
    state,
    client
  };
}

function setBarberState(currentState: State['barbers'], event: BarberEvent): State['barbers'] {
  let newState: Array<Barber>;
  switch(event.state) {
    case 'start':
      newState = currentState.slice();
      newState.push(initializeBarber(event.name, event.state));
      break;
    default: 
      newState = currentState.map(barber => {
        if (barber.name === event.name ) {
          return dispatchBarberEvent(barber, event);
        }
        return barber;
      });
  }
  return newState;
};

function setCustomerState(currentState: Array<Customer>, event: CustomerEvent): State['customers'] {
  let newState: Array<Customer>;
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
          return dispatchCustomerEvent(customer, event);
        }
        return customer;
      });
  }
  return newState;
};

function dispatchCustomerEvent(currentState: Customer, event: CustomerEvent) {
  return Object.assign({}, currentState, {
    state: event.state,
  });
}

function dispatchBarberEvent(currentState: Barber, event: BarberEvent): Barber {
    return Object.assign({}, currentState, {
      state: event.state,
      client: event.state === 'serving' ? event.customer_name : null,
    });
}
