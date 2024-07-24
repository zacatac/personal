// This file is auto-generated by @hey-api/openapi-ts

import type { CancelablePromise } from './core/CancelablePromise';
import { OpenAPI } from './core/OpenAPI';
import { request as __request } from './core/request';
import type { UserMeGetResponse } from './types.gen';

/**
 * User
 * @returns User Successful Response
 * @throws ApiError
 */
export const userMeGet = (): CancelablePromise<UserMeGetResponse> => { return __request(OpenAPI, {
    method: 'GET',
    url: '/me'
}); };