import { useCallback, useMemo, useRef } from 'react';
import { Selector, shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useDeepCompareEffect } from 'react-use';
import { ASYNC_STATUS } from '@gilbarbara/helpers';
import { AsyncFlowWithDataAndCache } from '@gilbarbara/types';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import is from 'is-lite';

import { hasValidCache } from '~/modules/helpers';

import { RootState } from '~/types';

export const useAppDispatch = () => useDispatch();

export function useAppSelector<TReturn>(selector: (state: RootState) => TReturn) {
  return useSelector(selector, shallowEqual);
}

export function useQuery<T>(
  selector: Selector<RootState, AsyncFlowWithDataAndCache<T>>,
  action: ActionCreatorWithPayload<any>,
  ...parameters: any[]
) {
  const dispatch = useAppDispatch();
  const { data, message, status, updatedAt } = useAppSelector(selector);
  const hasData = useMemo(() => (is.array(data) ? !!data.length : !!data), [data]);
  const actionParameters = useRef(parameters);

  useDeepCompareEffect(() => {
    actionParameters.current = parameters;

    if ((!hasData && status !== ASYNC_STATUS.SUCCESS) || !hasValidCache(updatedAt)) {
      dispatch(action(parameters));
    }
  }, [action, dispatch, hasData, parameters, updatedAt]);

  const refresh = useCallback(() => {
    dispatch(action(actionParameters.current));
  }, [action, dispatch]);

  return {
    data,
    isLoading: status === ASYNC_STATUS.PENDING || (status === ASYNC_STATUS.IDLE && !hasData),
    message,
    refresh,
    status,
  };
}
