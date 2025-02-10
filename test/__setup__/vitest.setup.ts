import '@testing-library/jest-dom';

import { configure } from '@testing-library/react';
import * as matchers from 'jest-extended';
import createFetchMock from 'vitest-fetch-mock';

configure({ testIdAttribute: 'data-component-name' });

expect.extend(matchers);

const fetchMock = createFetchMock(vi);

fetchMock.enableMocks();
