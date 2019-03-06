const { getUserInfo } = require('../../utils/api');
const { HELPCENTER_URL } = require('../../config.js');
const { createWebUrl } = require('../../utils/util');

// pages/my/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    username: null
  },
  goToLogin: function() {
    wx.navigateTo({
      url: '/pages/login/index'
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},
  navigateToWeb: function() {
    wx.navigateTo({
      url: createWebUrl('/pages/webview/index', HELPCENTER_URL)
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (getApp().globalData.ticket) {
      getUserInfo().then(res => {
        if (res.assertion && res.assertion.username) {
          this.setData({
            username: res.assertion.username
          });
        }
      });
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
