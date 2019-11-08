import { get, post } from './fetch';

export const endpoints = {
  /** @type {Endpoint} */
  login: 'api/user/login',
  /** @type {Endpoint} */
  register: 'api/user/register',
  /** @type {Endpoint} */
  userData: 'api/user',
};

/** Attempts to log the user in
 * @returns {Promise<import("axios").AxiosResponse>}
 */
export const loginUser = userData => post(endpoints.login, userData);
/** Attempts to register the user
 * @returns {Promise<import("axios").AxiosResponse>}
 */
export const registerUser = userData => post(endpoints.register, userData);

/** Retrieves user data using handle
 * @param {string} handle
 */
export const getUserData = handle => {
  return get(endpoints.userData + `/${handle}`);
};

/**
 * @typedef {import('./fetch').Endpoint} Endpoint
 */