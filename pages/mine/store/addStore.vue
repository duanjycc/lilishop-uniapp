<template>
  <view class="add-address">
    <div class="uForm">
      <u-form :border-bottom="false" :model="form" ref="uForm" :error-type="['toast']" :rule="rules">
        <u-form-item class="border" label="会员名称" label-width="130" prop="name">
         <view v-if="id">{{form.memberName}}</view>
		 <view v-else> {{ userInfo.member.mobile }}</view>
        </u-form-item>
        <u-form-item class="border" label="商铺名称" label-width="130" prop="name">
          <u-input v-model="form.storeName" clearable placeholder="请输入商铺名称" />
        </u-form-item>

		<u-form-item class="border" label="经营范围" label-width="130" prop="name">
			<u-input v-model="form.goodsManagementCategoryName" type="select" @click="showSelMany" placeholder="经营范围" />
			<uni-popup ref="fw_popup" type="bottom">
				<sel-many :list="systemScopes" :defultValue="form.goodsManagementCategory" :defultName="form.goodsManagementCategoryName" @change="getIds" @close="close" :setType="true"></sel-many>
			</uni-popup>
		</u-form-item>

		<u-form-item class="border" label="店铺地址" label-width="130" prop="name">
		  <u-input v-model="form.storeAddressPath" clearable placeholder="店铺地址" @click="getLoaction"/>
		</u-form-item>
		<u-form-item class="border" label="经纬度" label-width="130" prop="name">
		  <view>{{form.storeCenter }}</view> 
		</u-form-item>
		
		<u-form-item class="detailAddress" label="详细地址" label-width="130" prop="name">
		  <u-input v-model="form.storeAddressDetail" height="200" type="textarea"   clearable placeholder="请输入详细地址" />
		</u-form-item>
 

		<u-form-item class="detailAddress" label="店铺照片" label-width="130" prop="name">
		  <view  v-if="id">
		    <image style=" width: 200rpx; height: 200rpx;" :src="form.storeLogo"/></image>
		  </view>
		  <view class="opt-view"  v-else >
			  <view class="images-view">
			    <u-upload :header=" { accessToken: storage.getAccessToken() }" :action="action" width="150" @on-uploaded="onUploaded" :max-count="2" :show-progress="false"></u-upload>
			  </view>
		  </view>
		</u-form-item> 
		
		<u-form-item class="detailAddress" label="店铺简介" label-width="130" prop="name">
		  <u-input v-model="form.storeDesc"  height="200" type="textarea"   clearable placeholder="请输入店铺简介" />
		</u-form-item>
			
        <div  v-if="id" >
			<div class="saveAuditBtn" @click="audit('pass')">通过</div>
			<div class="saveAuditBtn" style="background-color: #cc3636;" @click="audit('noPass')">不通过</div>
        </div>
        <div class="saveBtn" v-else @click="save">保存</div>
      <!--  <div class="saveBtn" v-if="id" @click="audit('noPass')">不通过</div> -->
     
      </u-form>

     <uniMap ref="unMap"  @close="closeMap" @callback="callBackAddress" />
    </div>
  </view>
</template>
<script>
import storage from "@/utils/storage.js";
import { getCategoryList } from "@/api/goods.js";
import { settleIn,getStoreBaseInfo,storeAudit } from "@/api/store.js";
import selMany from "@/components/m-city/sel-many.vue";
import { upload } from "@/api/common.js";
import { feedBack } from "@/api/members.js";
import uniMap from "../address/uniMap";
import permision from "@/js_sdk/wa-permission/permission.js";

export default {
  name:'addStore',
  components: {
    "sel-many": selMany,
    uniMap,
  },
  data() {
    return {
	  radiolist:[{name: '自营',disabled: false},{name: '非自营', disabled: false}],
	  systemScopes:[],
      lightColor: this.$lightColor, //高亮颜色
      mapFlage: false, // 地图选择开
      routerVal: "",
	  storage,
	  action: upload, //图片上传地址
	  id:null,
      form: {
		memberName:"",
		storeName: "", // 店铺名称
		goodsManagementCategoryName: "", // 经营范围名称
		goodsManagementCategory: "", // 经营范围id
        storeAddressPath: "", //店铺地址
        storeCenter: "",  // 经纬度
		storeDesc: "", // 店铺描述
        storeAddressIdPath: null, //地址id
        storeAddressPath: null, //地址名字
		storeAddressDetail: null, //地址详情
		storeLogo:null
      },
      // 表单提交校验规则
      rules: {
			storeName: [
			  {
				required: true,
				message: "店铺名称不能为空",
				trigger: ["blur", "change"],
			  },
			],
		}
    };

  },
  onShow() {
	this.userInfo = this.$options.filters.isLogin();
	this.loadData();
  },
  methods: {
	async loadData() {
		let list = await getCategoryList(0);
		this.systemScopes = list.data.result;
	},
	getLoaction(){
		this.$refs.unMap.init();
	},
	  //图片上传
	onUploaded(lists) {
	    let images = [];
	    lists.forEach((item) => {
	      images.push(item.response.result);
		  this.form.storeLogo = images.join(",");
	    });
		
	},
	showSelMany() {
	   this.$refs.fw_popup.open();
	},
	getIds(ids,names){
		this.form.goodsManagementCategoryName = names;
		this.form.goodsManagementCategory = ids;
		this.$refs.fw_popup.close();
	},
    // 关闭地图
    closeMap() {
      this.mapFlage = false;
    },
    // 打开地图并访问权限
    clickUniMap() {
      // #ifdef APP-PLUS
      if (plus.os.name == "iOS") {
        // ios系统
        permision.judgeIosPermission("location")
          ? (this.mapFlage = true)
          : this.refuseMapOuther();
      } else {
        // 安卓
        this.requestAndroidPermission(
          "android.permission.ACCESS_FINE_LOCATION"
        );
      }
      // #endif

      // #ifndef APP-PLUS
      this.mapFlage = true;
      // #endif
    },
	audit(operation) {
      let id = this.$route.query.id;
      if (operation === "pass") {
        storeAudit(id, 0).then((res) => {
          if (res.data.success) {
              uni.navigateBack();
          }
        });
      } else {
        storeAudit(id, 1).then((res) => {
          if (res.data.success) {
              uni.navigateBack();
          }
        });
      }
    },
    // 如果拒绝权限 提示区设置
    refuseMapOuther() {
      uni.showModal({
        title: "温馨提示",
        content: "您已拒绝定位,请开启",
        confirmText: "去设置",
        success(res) {
          if (res.confirm) {
            //打开授权设置
            // #ifndef MP-WEIXIN
            uni.getSystemInfo({
              success(res) {
                if (res.platform == "ios") {
                  //IOS
                  plus.runtime.openURL("app-settings://");
                } else if (res.platform == "android") {
                  //安卓
                  let main = plus.android.runtimeMainActivity();
                  let Intent = plus.android.importClass(
                    "android.content.Intent"
                  );
                  let mIntent = new Intent("android.settings.ACTION_SETTINGS");
                  main.startActivity(mIntent);
                }
              },
            });
            // #endif
          }
        },
      });
    },

    // 获取安卓是否拥有地址权限
    async requestAndroidPermission(permisionID) {
      var result = await permision.requestAndroidPermission(permisionID);

      if (result == 1) {
        this.mapFlage = true;
      } else {
        this.refuseMapOuther();
      }
    },

    // 选择地址后数据的回调
    callBackAddress(val) {
      uni.showLoading({
        title: "加载中",
      });

      if (val.regeocode && val) {
        let address = val.regeocode;
        this.form.storeAddressDetail = address.formatted_address; //地址详情
        this.form.storeAddressIdPath = val.data.result.id; // 地址id分割
        this.form.storeAddressPath = val.data.result.name; //地址名称， '，'分割
        this.form.storeCenter = val.longitude +"," +val.latitude; //纬度
        uni.hideLoading();
      }

      this.mapFlage = !this.mapFlage; //关闭地图
    },

    // 保存当前 地址
    save() {
      this.$refs.uForm.validate((valid) => {
        if (valid) {
          let pages = getCurrentPages(); //获取页面栈
          let beforePage = pages[pages.length - 2]; //上个页面
          // 如果没有id则为新增地址
          if (!this.form.id) {
            settleIn(this.form).then((res) => {
              if (res.data.success) {
                uni.navigateBack();
              }
            });
          } 
        }
      });
    },
    
  },
  mounted() {},

  onLoad(option) {
    uni.showLoading({
      title: "加载中",
    });
    this.routerVal = option;
    // 如果当前是编辑地址,则需要查询出地址详情信息
    if (option.id) {
	  this.id = option.id
      getStoreBaseInfo(option.id).then((res) => {
        const params = res.data.result;
        this.$set(this, "form", params);
        uni.hideLoading();
      });
    }
    uni.hideLoading();
  },
  // 初始化rules必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
  onReady() {
    this.$refs.uForm.setRules(this.rules);
  },
};
</script>
<style scoped lang="scss">
	
.detailAddress {
  /deep/ .u-form-item--left {
    display: flex;
    align-items: flex-start;
  }
}
.saveBtn,
	.selectAddress {
	  height: 70rpx;

	  line-height: 70rpx;
	  text-align: center;
	  font-size: 30rpx;
	  background: $aider-light-color;
	  color: #fff;
	  width: 70%;
	  margin: 40rpx auto 0 auto;
	  border-radius: 20rpx;
	}
	
.saveAuditBtn{
	height: 70rpx;
	
	line-height: 70rpx;
	text-align: center;
	font-size: 30rpx;
	background: $aider-light-color;
	color: #fff;
	width: 35%;
	margin: 40rpx auto 0 auto;
	border-radius: 20rpx;
	float: left;
	margin-left: 65rpx;

}
.selectAddress {
  margin-top: 40rpx;
  background: #fff;

  color: $aider-light-color;
  border: 2rpx solid $aider-light-color;
}

.uForm {
  width: 94%;
  overflow: hidden;
  left: 3%;
  position: relative;
  top: 2%;
  background: #fff;
  border-radius: 20rpx;
  padding: 0 0 40rpx 0;
}
.add-address {
  width: 100%;
  padding-top: 3%;

  /deep/ .u-form-item {
    background-color: #fff;
    padding: 24rpx 30rpx;
  }
  .u-btn {
    margin: 30rpx 30rpx 0 30rpx;
    background-color: $main-color;
  }

  /deep/.u-checkbox {
    margin: 30rpx 30rpx 0 30rpx;

    .u-label-class.u-checkbox__label {
      color: $font-color-light;
      font-size: $font-sm;
    }
  }
}
/deep/ .u-checkbox__label {
  font-size: 28rpx;
}
</style>
