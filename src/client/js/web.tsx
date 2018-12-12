import ReactDOM from 'react-dom';
import React from 'react';

import css from '../scss/main.scss';

import MessageRoom from './MessageRoom';

const container = document.getElementById('message');

ReactDOM.render(<MessageRoom />, container);
