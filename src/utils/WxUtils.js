import Tips from './Tips'
import wepy from 'wepy'

export default class WxUtils {
  static tabUrls = ['/pages/home/template', '/pages/goods/category', '/pages/goods/cart', '/pages/customer/index', '/pages/customer/index_template'];
  static mapUrls = {
    '/pages/shop/index': '/pages/home/template',
    '/pages/home/home': '/pages/home/template'
  };

  static isTab (url) {
    const type = wepy.$instance.globalData.shopType
    return type === 1 && this.tabUrls.some(path => path === url)
  }
  static mapUrl (url) {
    const type = wepy.$instance.globalData.shopType
    if (type === 1 && this.mapUrls[url]) {
      return this.mapUrls[url]
    } else {
      return url
    }
  }

  /**
   * 如果能够后退（多层），则navigaetBack，否则调用redirectTo
   */
  static backOrRedirect(url) {
    url = this.mapUrl(url)
    if (this.isTab(url)) {
      wepy.switchTab({
        url: url
      })
    } else {
      const pages = getCurrentPages()
      // route在低版本不兼容
      const index = pages.findIndex(item => ('/' + item.__route__) === url)
      if (pages.length < 2 || index < 0) {
        wepy.redirectTo({
          url: url
        });
      } else {
        const delta = pages.length - 1 - index;
        wepy.navigateBack({
          delta: delta
        })
      }
    }
  }
  /**
   * 如果能够后退（多层），则navigaetBack，否则调用navigateTo
   */
  static backOrNavigate(url) {
    url = this.mapUrl(url)
    if (this.isTab(url)) {
      wepy.switchTab({
        url: url
      })
    } else {
      const pages = getCurrentPages()
      // route在低版本不兼容
      const index = pages.findIndex(item => ('/' + item.__route__) === url);
      if (pages.length < 2 || index < 0) {
        wepy.navigateTo({
          url: url
        })
      } else {
        const delta = pages.length - 1 - index
        wepy.navigateBack({
          delta: delta
        })
      }
    }
  }

  static wxPay(param) {
    return new Promise((resolve, reject) => {
      wepy.requestPayment({
        ...param,
        complete: res => {
          if (res.errMsg === 'requestPayment:ok') {
            resolve(res)
          } else {
            reject(res)
          }
        }
      })
    })
  }

  /**
   * api兼容性判断
   */
  static canIUse(str) {
    if (wepy.canIUse) {
      return wepy.canIUse(str)
    } else {
      return false
    }
  }
  /**
   * 检查SDK版本
   */
  static isSDKExipred() {
    const {SDKVersion} = wepy.getSystemInfoSync()
    return SDKVersion == null || SDKVersion < '1.2.0'
  }
  /**
   * 检查SDK版本
   */
  static checkSDK() {
    if (this.isSDKExipred()) {
      Tips.modal('您的微信版本太低，为确保正常使用，请尽快升级');
    }
  }
}
