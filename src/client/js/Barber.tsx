import React from 'react';
import { Component, ReactNode } from 'react';

interface BarberBaseProps {
  name: string;
  state: string;
}

export default class BarberBase extends Component {
  public props: BarberBaseProps;
  constructor(props: BarberBaseProps) {
    super(props);
  }

  public render(): ReactNode {
    return (
      <section className='person barber'>
          <h1>{ this.props.name }</h1>
          <h2>{ this.props.state }</h2>
      </section>
    );
  }
}