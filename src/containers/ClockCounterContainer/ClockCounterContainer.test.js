import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import ClockCounterContainer from './ClockCounterContainer';

let TestComponent;

describe('ClockCounterContainer', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<ClockCounterContainer />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('should have rendered using renderer()', () => {
    TestComponent = renderer.create(<ClockCounterContainer />);
    let tree = TestComponent.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
