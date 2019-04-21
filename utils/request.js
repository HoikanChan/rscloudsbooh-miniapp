const { HOST, MART_HOST } = require('../config.js');
// 用Promise 封装wx.request
// 参数url： 路径
// 参数data： 查询数据
// 参数method： 查询方法
// 参数host： 主机地址 ，由于需要调用集市接口，为[mart]时切换为集市主机地址
// P.s.由于部分接口后台需要查询 sessionId，微信小程序缺少cookie功能，手动加入sessionId
function request(url, data = {}, method = 'GET', host = HOST) {
  let sessionId = '';
  //本地取存储的sessionID
  sessionId =
    host === 'mart'
      ? wx.getStorageSync('MART_JSESSIONID')
      : wx.getStorageSync('JSESSIONID');
  return new Promise(function(resolve, reject) {
    wx.request({
      url: (host === 'mart' ? MART_HOST : host) + url,
      data: data,
      method: method.toString(),
      header: {
        'Content-Type':
          method === 'POST'
            ? 'application/x-www-form-urlencoded'
            : 'application/json',
            //提交定制报告时 必须加ticket在cookie钟才能通过登录验证
        Cookie: `JSESSIONID=${sessionId};CASTGC=${getApp()?getApp().globalData.ticket || '':''}`
      },
      success: function(res) {
        // 记录ssesionId
        if (sessionId === '' || (sessionId === null && res.cookies)) {
          host === 'mart'
            ? wx.setStorageSync(
                'MART_JSESSIONID',
                /JSESSIONID=(.*?);/.exec(res.header['Set-Cookie'])[1]
              )
            : wx.setStorageSync(
                'JSESSIONID',
                /JSESSIONID=(.*?);/.exec(res.header['Set-Cookie'])[1]
              );
        }
        if (res.statusCode === 500){
          reject()
          wx.showToast({
            title: '服务端发生异常，请重试',
          })
        }
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
      fail: function(err) {
        resolve(err);
      }
    });
  });
}
module.exports = request;
