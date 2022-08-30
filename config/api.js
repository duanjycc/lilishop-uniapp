/**
 * base    : 基础业务API
 * buyer   : 买家API
 */
// 开发环境
const dev = {
	common: "https://wang.wantbibi.com/common-api",
	// buyer: "https://wang.wantbibi.com/buyer-api",
 
	// common: "http://8.136.107.94:7003",
	// buyer: "http://8.136.107.94:7002",
 
	// common: "http://192.168.0.106:8890",
	buyer: "http://192.168.0.103:8888",
};
// 生产环境
const prod = {
  common: "https://wang.wantbibi.com/common-api",
  buyer: "https://wang.wantbibi.com/buyer-api",
};

//默认生产环境
let api = dev;
//如果是开发环境
if (process.env.NODE_ENV == "development") {
  api = dev;
} else {
  api = prod;
}
//微信小程序，app的打包方式建议为生产环境，所以这块直接条件编译赋值
// #ifdef MP-WEIXIN || APP-PLUS
api = prod;
// #endif

api.buyer += "/buyer";
api.common += "/common";
export default {
  ...api,
};
