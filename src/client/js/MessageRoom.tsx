import io from 'socket.io-client';
import React from 'react';
import {
	Component
} from 'react';

interface MessageRoomState {
	messages: Array <string> ;
}

export default class MessageRoom extends Component {
	public state: MessageRoomState;
	constructor(props: any) {
		super(props);
		this.state = {
			messages: [],
		}
	}

	setMessage(message: string) {
		if (this.state.messages.length == 50) {
			this.setState({
				messages: [message]
			});
		} else {
			this.setState({
				messages: [...this.state.messages, message]
			});
		}
	}

	componentDidMount() {
		const socket = io({
			path: '/channel',
		});

		socket.on('message', (data: string) => {
			this.setMessage(data);
		});
	}

	render() {
		const messages = this.state.messages.map(message => <li>{ message }</li>);
			return (
				<ul>
					{ messages }
				</ul>
			);
	}
}