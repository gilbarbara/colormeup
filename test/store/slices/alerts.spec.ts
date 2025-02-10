import reducer, { alertHide, alertShow, alertsState } from '~/store/slices/alerts';

vi.mock('@gilbarbara/helpers', () => {
  const helpers = vi.importActual('@gilbarbara/helpers');

  return {
    ...helpers,
    uuid: () => 'ABC1',
  };
});

const successOptions = {
  type: alertShow.type,
  payload: {
    content: 'Alright!',
    icon: undefined,
    id: 'ABC1',
    position: 'top-right',
    skipWrapper: undefined,
    type: 'success',
    timeout: 5,
  },
};

const errorOptions = {
  type: alertShow.type,
  payload: {
    ...successOptions.payload,
    content: 'ERROR!',
    position: 'bottom-right',
    type: 'error',
    timeout: 0,
  },
};

describe('slices/alerts', () => {
  describe('actions', () => {
    it(`${alertHide.type} should return properly`, () => {
      expect(alertHide('ABC1')).toEqual({
        type: 'alerts/alertHide',
        payload: 'ABC1',
      });
    });

    it(`${alertShow.type} should return properly`, () => {
      expect(alertShow('Alright!', { type: 'success' })).toEqual(successOptions);

      expect(alertShow('ERROR!', { type: 'error', timeout: 0, position: 'bottom-right' })).toEqual(
        errorOptions,
      );
    });
  });

  describe('reducers', () => {
    let alerts = reducer(alertsState, { type: 'init' });

    it(`should handle ${alertShow.type} success action`, () => {
      alerts = reducer(alerts, alertShow('Alright!', { type: 'success' }));
      expect(alerts.data).toEqual([successOptions.payload]);
    });

    it(`should handle ${alertHide.type} action`, () => {
      alerts = reducer(alerts, alertHide('ABC1'));
      expect(alerts.data).toEqual([]);
    });

    it(`should handle ${alertShow.type} success action`, () => {
      alerts = reducer(
        alerts,
        alertShow('ERROR!', { type: 'error', timeout: 0, position: 'bottom-right' }),
      );
      expect(alerts.data).toEqual([errorOptions.payload]);

      alerts = reducer(alerts, alertHide('ABC1'));
      expect(alerts.data).toEqual([]);
    });
  });

  describe('state', () => {
    const alerts = reducer(alertsState, { type: 'init' });

    it('should return the initial state', () => {
      expect(reducer(alerts, { type: 'init' })).toEqual({
        data: [],
      });
    });
  });
});
