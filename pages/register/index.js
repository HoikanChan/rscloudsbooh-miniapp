const { IMGCODE_URL } = require('../../config.js');
const api = require('../../utils/api.js');
const { mobileReg } = require('../../utils/util.js');
// pages/book/book.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    codeText: '验证码',
    imgCode: IMGCODE_URL,
    code: '',
    repeatPassword: '',
    form: {
      userName: '',
      userPassword: '',
      userPhone: '',
      scode: '',
      type: 1
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  changeCode: function() {
    this.setData({
      imgCode: IMGCODE_URL + '?' + Math.random()
    });
  },
  getCode: function() {
    const { userPhone } = this.data.form;
    if (!(userPhone && mobileReg.test(userPhone))) {
      wx.showToast({
        title: '请输入有效手机号码',
        icon: 'none'
      });
      return;
    }
    this.setData({
      loading: true
    });
    api
      .registerGetCode({ phone: userPhone, imageCode: this.data.code })
      .then(res => {
        this.setData({
          loading: false
        });
        if (res.code === '1') {
          this.countDown(60, () => {
            this.setData({
              codeText: '验证码'
            });
          });
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          });
        }
      });
  },
  countDown: function(time, callback) {
    this.setData({
      codeText: time
    });
    var t = setInterval(() => {
      if (time < 1) {
        clearInterval(t);
        callback();
      } else {
        this.setData({
          codeText: time
        });
        time--;
      }
    }, 1000);
  },
  bindKeyInput: function(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({
      [key]: e.detail.value
    });
  },

  register: function() {
    const { form, repeatPassword } = this.data;
    for (let key in form) {
      if (!form[key]) {
        wx.showToast({
          title: '请完善信息',
          icon: 'none'
        });
        return;
      }
    }
    if (
      !(form.userPassword === repeatPassword && form.userPassword.length > 6)
    ) {
      wx.showToast({
        title: '请输入两次长度大于6位的相同密码',
        icon: 'none'
      });
      return;
    }
    this.setData({
      loading: true
    });
    api.register(this.data.form).then(res => {
      this.setData({
        loading: false
      });
      if (res.code === '1') {
        wx.showModal({
          title: '成功',
          content: res.message,
        })
        setTimeout(function(){
          wx.navigateBack();
        },1000)
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none'
        });
      }
    });
  },

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
