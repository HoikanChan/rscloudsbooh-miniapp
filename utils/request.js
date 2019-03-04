const host = 'http://yunbao.rscloudmart.com/';
const { HOST } = require('../config.js')

function request(url, data = {}, method = "GET") {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: HOST + url,
      data: data,
      method: method.toString(),
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (res.statusCode == 200) {
          if (res.data.errno == 501) {
            // 清除登录相关内容
            try {
              wx.removeStorageSync('userInfo');
              wx.removeStorageSync('token');
            } catch (e) {
              // Do something when catch error
            }
            // 切换到登录页面
            wx.navigateTo({
              url: '/pages/auth/login/login'
            });
          } else {
            resolve(res.data);
          }
        } else {
          reject(res.data);
        }
      },
      fail: function (err) {
        debugger
        resolve(err);
      }
    })
  });
}
module.exports = request;