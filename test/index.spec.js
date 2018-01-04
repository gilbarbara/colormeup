import React from 'react';
import { AppConstants, ColorConstants, UserConstants } from 'constants/index';
import '../app/scripts/index';

jest.mock('redux-persist/lib/integration/react', () => ({
  PersistGate: () => (<div />),
}));

describe('Constants:AppConstants', () => {
  it('should match the snapshot', () => {
    expect(AppConstants).toMatchSnapshot();
  });
});

describe('Constants:ColorConstants', () => {
  it('should match the snapshot', () => {
    expect(ColorConstants).toMatchSnapshot();
  });
});

describe('Constants:UserConstants', () => {
  it('should match the snapshot', () => {
    expect(UserConstants).toMatchSnapshot();
  });
});
