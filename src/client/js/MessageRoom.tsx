import io from 'socket.io-client';
import React from 'react';
import {
	Component
} from 'react';

import { Store, Customer } from '../../server/controllers';
import CustomerTable from './CustomerTable';
import BarberTable from './BarberTable';
import ManagePanel from './ManagePanel';

const socket: SocketIOClient.Socket = io({
	path: '/channel',
});

interface MessageRoomState {
	store : Store;
	socket: SocketIOClient.Socket;
};

export default class MessageRoom extends Component<{}, MessageRoomState> {
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

	public componentDidMount(): void {
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

	public removeCustomer(customer: Customer): void {
		this.state.socket.emit('change-state', {
			name: customer.name,
			emitter: 'customer',
			state: 'delete',
		});
	}

	public addCustomer(): void {
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
						<BarberTable barbers={this.state.store.barbers} title='Barbers' />
					</section>
					<section className='message-cell'>
						<CustomerTable customers={this.state.store.customers} title='Wait Queue' state={'waiting'}/>
					</section>
					<section className='message-cell'>
						<CustomerTable customers={this.state.store.customers} title='Leave' state={'full'}/>
					</section>
				</div>
					<section>
						<ManagePanel socket={socket} addCustomer={this.addCustomer} />
					</section>
				</React.Fragment>
			);
	}
};
