import io from 'socket.io-client';
import React from 'react';
import {
	Component
} from 'react';
import { Store } from '../../server/controllers';

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

	private onClick(event: Event) {
		this.state.socket.emit('client', 'Front end message.');
	}

	render() {
		const customers = this.state.store.customers.map(customer => (
			<tr key={ customer.name }>
				<th>{ customer.name }</th>
				<th>{ customer.state } </th>
			</tr>
		));
		const barbers = this.state.store.barbers.map(barber => (
			<tr key={ barber.name }>
				<th> { barber.name } </th>
				<th> {barber.state } </th>
				<th> {barber.client || 'None'} </th>
			</tr>
		));
			return (
				<div>
					<section>
						<table>
							<tbody>
							{ barbers }
							</tbody>
						</table>
					</section>
					<section>
						<table>
							<tbody>
							{ customers }
							</tbody>
						</table>
					</section>
				</div>
			);
	}
}