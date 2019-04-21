import api from 'utils/api';
//app.js
App({
  onLaunch: function() {
    // // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })


    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     debugger
        // if (res.authSetting['scope.userInfo']) {} else {
          wx.redirectTo({
            url: '/pages/authorization/index',
          })
        // }
    //   }
    // })

  },
  globalData: {
    userInfo: null
  }
})