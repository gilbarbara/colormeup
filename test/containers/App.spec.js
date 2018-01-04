import React from 'react';
import { shallow } from 'enzyme';

import { App } from 'containers/App';

const mockDispatch = jest.fn();

const props = {
  app: {},
  color: {},
  dispatch: mockDispatch,
  router: {},
  user: {},
};

function setup(ownProps = props) {
  return shallow(<App {...ownProps} />);
}

describe('App', () => {
  const wrapper = setup();
  const instance = wrapper.instance();

  it('should be a Component', () => {
    expect(instance instanceof React.Component).toBe(true);
  });
});
