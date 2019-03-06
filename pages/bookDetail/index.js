const { BOOK_DOWNLOAD_HOST } = require('../../config.js');
const { BOOK_HOST } = require('../../config.js');
const { createWebUrl } = require('../../utils/util');

// pages/bookDetail/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    bookid: '',
    img: '',
    time: '',
    title: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function({ bookid, img, time, title }) {
    this.setData({
      bookid,
      img,
      time,
      title
    });
  },
  // 点击下载云报
  downloadBook: function() {
    wx.downloadFile({
      url: `${BOOK_DOWNLOAD_HOST}?id=${this.data.bookid}&downloadFlag=1`,
      header: {
        Cookie: 'JSESSIONID=' + wx.getStorageSync('JSESSIONID')
      }
    });
  },
  // 点击查看云报
  viewBook: function() {
    wx.navigateTo({
      url: createWebUrl('/pages/webview/index', BOOK_HOST, {
        id: this.data.bookid
      })
    });
  }
});
