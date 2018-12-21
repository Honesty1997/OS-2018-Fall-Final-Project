import io from 'socket.io-client';
import React from 'react';
import {
	Component
} from 'react';
import { Store, Customer } from '../../server/controllers';
import CustomerTable from './CustomerTable';
import BarberTable from './BarberTable';

const socket: SocketIOClient.Socket = io({
	path: '/channel',
});

interface MessageRoomState {
	store : Store;
	socket: SocketIOClient.Socket;
};

export default class MessageRoom extends Component {
	public state: MessageRoomState;
	constructor(props: any) {
		super(props);
		this.state = {
			store: {
				customers: [],
				barbers: [],
			},
			socket,
		}
		this.addCustomer = this.addCustomer.bind(this);
	}

	public componentDidMount() {
		socket.on('message', (store: Store) => {
			store.customers.forEach(customer => {
				if (customer.state == 'full') {
					setTimeout(()=> {
						this.removeCustomer(customer);
					},
					2000);
				}
			});
			this.setState({ store });
		});

		this.setState({ socket: socket });
	}

	public removeCustomer(customer: Customer) {
		this.state.socket.emit('change-state', {
			name: customer.name,
			emitter: 'customer',
			state: 'delete',
		});
	}

	public addCustomer() {
		this.state.socket.emit('client', {
			type: 'add',
			target: 'customer'
		});
	}

	render() {
			return (
				<React.Fragment>
					<div className='message-table'>
					<section className='message-cell'>
						<BarberTable barbers={this.state.store.barbers} />
					</section>
					<section className='message-cell'>
						<CustomerTable customers={this.state.store.customers} state={'waiting'}/>
					</section>
					<section className='message-cell'>
						<CustomerTable customers={this.state.store.customers} state={'full'}/>
					</section>
				</div>
					<section>
						<button className="btn" onClick={this.addCustomer}>Add a customer</button>
					</section>
				</React.Fragment>
			);
	}
};
