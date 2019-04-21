// pages/myBooks/index.js
const api = require('../../utils/api.js');
const {
  IMG_URL
} = require('../../config.js');
const {
  formatTime,
  debounce
} = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,

    mybookList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // 处理api数据
  formatListData: function(list) {
    return list.map(item => {
      return {
        time: formatTime(new Date(item.ctTime)),
        img_url: IMG_URL + item.coverPlanPath,
        ...item
      };
    });
  },
  onLoad: function(options) {
    const openid = getApp().globalData.openid;
    if (!openid) {
      wx.navigateTo({
        url: '/pages/authorization/index'
      });
    }
    let orderList = [];
    this.setData({
      loading: true
    })
    api.getPurchasedBooks(openid).then(res => {
      if (res.orderList.length > 0) {
        orderList = res.orderList.map(i => i.cloadBooksId)
      }
      return api.getIndexContent()
    }).then(res => {
      let mybookList = orderList.map(orderId => {
        let orderItem
        for (let listKey in res) {
          if (Array.isArray(res[listKey])) {
            orderItem = res[listKey].find(i => i.id === orderId)
          }
          if (orderItem) {
            break
          }
        }
        return orderItem
      })
      this.setData({
        loading: false,
        mybookList: mybookList.length ? this.formatListData(mybookList) : []
      })
    })
  },
  // 点击查看云报
  viewBook: function ({
    currentTarget
  }) {
    // bookid,img,time,title
    let url = '/pages/bookDetail/index?';
    const data = currentTarget.dataset;
    if (Object.keys(data).length) {
      for (let key in data) {
        url += `${key}=${data[key]}&`;
      }
      url = url.slice(0, -1);
      wx.navigateTo({
        url: url
      });
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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