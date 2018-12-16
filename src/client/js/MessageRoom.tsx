import io from 'socket.io-client';
import React from 'react';
import {
	Component
} from 'react';
import { Store } from '../../server/controllers';
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
	}

	public componentDidMount() {
		socket.on('message', (store: Store) => {
			this.setState({ store });
		});

		this.setState({ socket: socket });
	}

	render() {
			return (
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
			);
	}
};
