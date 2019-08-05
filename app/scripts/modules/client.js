// @flow
/**
 * Client
 * @module Client
 */

export function parseError(error: string): string {
  return error || 'Something went wrong';
}

/**
 * Fetch data
 *
 * @param {string} url
 * @param {Object} options
 * @param {string} [options.method] - Request method ( GET, POST, PUT, ... ).
 * @param {string} [options.payload] - Request body.
 * @param {Object} [options.headers]
 *
 * @returns {Promise}
 */
export function request(url: string, options: Object = {}): Promise<*> {
  const config = {
    method: 'GET',
    ...options,
  };
  const errors = [];

  if (!url) {
    errors.push('url');
  }

  if (!config.payload && (config.method !== 'GET' && config.method !== 'DELETE')) {
    errors.push('payload');
  }

  if (errors.length) {
    throw new Error(`Error! You must pass \`${errors.join('`, `')}\``);
  }

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...config.headers,
  };

  const params: Object = {
    headers,
    method: config.method,
  };

  if (params.method !== 'GET') {
    params.body = JSON.stringify(config.payload);
  }

  return fetch(url, params).then(async response => {
    if (response.status > 299) {
      const error: Object = new Error(response.statusText || response.status);

      error.status = response.status;
      throw error;
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }

    return response.text();
  });
}
