// pages/authorization/index.js
const api = require('../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // wx.reLaunch({ url: '/pages/authorization/index', })
    wx.login({
      success: res => {
        getApp().globalData.userCode = res.code
        api.getUserOpenid(res.code).then(res => {
          if (res.openid){
            getApp().globalData.openid = res.openid

          }
        })
      }
    })
  },
  gotUserInfo: function({
    detail
  }) {

    if (detail.userInfo) {
      getApp().globalData.userInfo = detail.userInfo
      wx.switchTab({
        url: '/pages/index/index'
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})