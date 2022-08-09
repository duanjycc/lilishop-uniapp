/**
 * base    : 基础业务API
 * buyer   : 买家API
 */
// 开发环境
const dev = {
 common: "http://wang.wantbibi.com/common-api",
 buyer: "http://wang.wantbibi.com/buyer-api",
 
  // common: "http://e6801ae.r2.cpolar.cn",
  // buyer: "http://79e72ced.r2.cpolar.cn",
};
// 生产环境
const prod = {
  common: "http://wang.wantbibi.com/common-api",
  buyer: "http://wang.wantbibi.com/buyer-api",
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
