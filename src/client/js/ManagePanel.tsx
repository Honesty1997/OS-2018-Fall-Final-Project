import React, { ChangeEvent } from 'react';

interface ManagePanelProps {
  socket: SocketIOClient.Socket;
  addCustomer :() => (void);
}

interface ManagePanelState {
  barberNum: number;
  seatNum: number;
  running: boolean;
}

export default class ManagePanel extends React.PureComponent<ManagePanelProps, ManagePanelState> {
  constructor(props: ManagePanelProps) {
    super(props);
    this.state = {
      running: true,
      barberNum: 4,
      seatNum: 5,
    }
    this.stopPythonProcess = this.stopPythonProcess.bind(this);
    this.restartPythonProcess = this.restartPythonProcess.bind(this);
    this.onBarberNumsChange = this.onBarberNumsChange.bind(this);
    this.onWaitingQueueNumsChange = this.onWaitingQueueNumsChange.bind(this);
  }

  public onBarberNumsChange(event: ChangeEvent<HTMLInputElement>): void {
    this.setState({ barberNum: Number(event.target.value) });
  }

  public onWaitingQueueNumsChange(event: ChangeEvent<HTMLInputElement>): void {
    this.setState({ seatNum: Number(event.target.value )});
  }

  public stopPythonProcess(): void {
    this.props.socket.emit('clear');
    this.setState({ running: false });
  }

  public restartPythonProcess(): void {
    this.props.socket.emit('restart', { 
      barberNum: this.state.barberNum,
      seatNum: this.state.seatNum,
    });
    this.setState({ running: true });
  }

  public render() {
    return (
      <section className='card blue lighten-5 manage-panel'>
      <div className='card-content'>
        <div className="input-field col">
          <input placeholder="default barber number(1 ~ 10)" max='10' min='1' type="number" value={this.state.barberNum} onChange={this.onBarberNumsChange} />
        </div>
          <div className="input-field col">
            <input placeholder="default waiting queue number(1 ~ )" min='1' type="number" value={this.state.seatNum} onChange={this.onWaitingQueueNumsChange}/>
          </div>
      </div>
        <div className='card-action'>
          <button className='btn waves-effect' onClick={this.props.addCustomer} disabled={!this.state.running}>Add a customer</button>
          <button className='btn waves-effect' onClick={this.stopPythonProcess } disabled={ !this.state.running }>Clear</button>
          <button className='btn waves-effect' onClick={this.restartPythonProcess } disabled={ this.state.running }>Start</button>
        </div>
      </section>
    );
  }
}
