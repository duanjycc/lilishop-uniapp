/**
 * 
 */

import {http, Method} from '@/utils/request.js';

/**
 * 区域-子区域收益
 * @param params
 */
export function profitArea(params) {
  return http.request({
    url: '/profit/area',
    method: Method.POST,
    params,
  });
}
