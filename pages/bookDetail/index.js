const {
  BOOK_DOWNLOAD_HOST
} = require('../../config.js');
const {
  BOOK_HOST
} = require('../../config.js');
const {
  createWebUrl
} = require('../../utils/util');
const api = require('../../utils/api.js');


// pages/bookDetail/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    isPurchased: false,
    bookid: '',
    img: '',
    time: '',
    title: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function({
    bookid,
    img,
    time,
    title
  }) {
    this.setData({
      bookid,
      img,
      time,
      title
    });
    const {
      userCode,
      openid
    } = getApp().globalData;
    if (!userCode) {
      wx.login({
        success: res => {
          getApp().globalData.userCode = res.code
        }
      })
    }
    if (!openid){
      wx.navigateTo({
        url: '/pages/authorization/index'
      });
    }
    api.getPurchasedBooks(openid).then(res => {
      if (res.orderList.length > 0 &&
        res.orderList.some(i => i.cloadBooksId === this.data.bookid)) {
        this.setData({
          isPurchased: true
        })

      }
    })
  },
  // 点击下载云报
  downloadBook: function() {
    // if (!getApp().globalData.ticket) {
    //   wx.navigateTo({
    //     url: '/pages/login/index'
    //   });
    //   return
    // }
    this.setData({
      loading: true
    });
    wx.downloadFile({
      url: `${BOOK_DOWNLOAD_HOST}${this.data.bookid}.pdf`,
      // url: 'https://yunbao.rscloudmart.com/pdfDownload/255d4619-04d5-462e-8577-4cd9c639fd72.pdf',
      header: {
        Cookie: 'JSESSIONID=' + wx.getStorageSync('JSESSIONID')
      },
      success: res => {
        this.setData({
          loading: false
        });

        wx.saveFile({
          tempFilePath: res.tempFilePath,
          success: function(res) {
            wx.openDocument({
              filePath: res.savedFilePath,
              fileType: 'pdf'
            })
            console.log(res)
            wx.showToast({
              title: '文件已保存'
            })
          }
        })
      }
    });
  },

  // 点击查看云报
  viewBook: function() {
    if (!getApp().globalData.ticket) {
      wx.navigateTo({
        url: '/pages/login/index'
      });
      return
    }
    // console.log(getApp().globalData);
    const userCode = getApp().globalData.userCode;

    let openId = getApp().globalData.openid;
    if (this.data.isPurchased) {
      wx.navigateTo({
        url: createWebUrl('/pages/webview/index', BOOK_HOST, {
          id: this.data.bookid
        })
      });
    } else {
      api.getPayParams(openId, this.data.bookid)
        .then(res => {
          console.log(res)
          wx.requestPayment({
            timeStamp: res.timeStamp,
            nonceStr: res.nonceStr,
            package: res.package,
            signType: res.signType,
            paySign: res.paySign,
            success: res => {
              wx.navigateTo({
                url: createWebUrl('/pages/webview/index', BOOK_HOST, {
                  id: this.data.bookid
                })
              });
            },
            fail: function (res) {
              wx.showToast({
                title: res,
                icon: 'none'
              });
            },
          })
        })
    }
  }
});