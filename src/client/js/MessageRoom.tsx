import io from 'socket.io-client';
import React from 'react';
import {
	Component
} from 'react';

const socket: SocketIOClient.Socket = io({
	path: '/channel',
});

interface MessageRoomState {
	messages: Array <string> ;
	socket: SocketIOClient.Socket;
};

const outerBoxStyle = {
	display: 'flex',
};

const innerStyle = {
	flex: 1,
};

export default class MessageRoom extends Component {
	public state: MessageRoomState;
	constructor(props: any) {
		super(props);
		this.state = {
			messages: [],
			socket,
		}
	}

	public setMessage(message: string) {
		if (this.state.messages.length == 40) {
			this.setState({
				messages: [message]
			});
		} else {
			this.setState({
				messages: [...this.state.messages, message]
			});
		}
	}

	public componentDidMount() {
		socket.on('message', (data: string) => {
			this.setMessage(data);
		});

		this.setState({ socket: socket });
	}

	private onClick(event: Event) {
		this.state.socket.emit('client', 'Front end message.');
	}

	render() {
		const messages = this.state.messages.map(message => <li>{ message }</li>);
			return (
				<div style={outerBoxStyle}>
					<section style={innerStyle}>
						<ul>
							{messages}
						</ul>
					</section>
					<section style={innerStyle}>
						<button onClick={this.onClick.bind(this)}>
							Send a message
					</button>
					</section>
				</div>
			);
	}
}