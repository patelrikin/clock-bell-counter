import React from 'react';
import ReactDOM from 'react-dom';
import ClockCounterContainer from './ClockCounterContainer';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ClockCounterContainer name=""/>, div);
  ReactDOM.unmountComponentAtNode(div);
});
