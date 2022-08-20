/**
 * 店铺相关API
 */

import {http, Method} from '@/utils/request.js';


/**
 * app商铺入驻
 * @param  params
 */
export function settleIn(data){
	return http.request({
	  url: "/store/store/settleIn",
	  method: Method.POST,
	  needToken: true,
	  header: { "content-type": "application/x-www-form-urlencoded" },
	  data: data,
	});
}

/**
 * app商铺审核
 * @param storeId
 */
export function storeAudit(id,pass) {
  return http.request({
    url: `/store/store/audit/${id}/${pass}`,
    method: Method.GET,
    loading: false,
  });
}

/**
 * 获取店铺列表
 * @param params
 */
export function getStoreList(params) {
  return http.request({
    url: '/store/store',
    method: Method.GET,
    params,
  });
}

/**
 * 获取店铺基本信息
 * @param storeId
 */
 export function getStoreBaseInfo(storeId) {
  return http.request({
    url: `/store/store/get/detail/${storeId}`,
    method: Method.GET,
    loading: false,
  });
}

/**
 * 获取店铺分类
 * @param id
 */
 export function getStoreCategory(id) {
  return http.request({
    url: `/store/store/label/get/${id}`,
    method: Method.GET,
  });
}


/**
 * 营业执照
 * @param id
 */
 export function getLicencePhoto(id) {
  return http.request({
    url: `/store/store/get/licencePhoto/${id}`,
    method: Method.GET,
  });
}




