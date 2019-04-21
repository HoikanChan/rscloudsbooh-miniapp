const api = require('../../utils/api.js');
const { mobileReg } = require('../../utils/util.js');

// pages/book/book.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    current: 0,
    codeText: '验证码',
    form: {
      phone: '',
      code: ''
    },
    newPassword: '',
    repeatPassword: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    wx.removeStorageSync('MART_JSESSIONID');
  },
  getCode: function() {
    const { phone } = this.data.form;
    if (!(phone && mobileReg.test(phone))) {
      wx.showToast({
        title: '请输入有效手机号码',
        icon: 'none'
      });
      return;
    }
    this.setData({
      loading: true
    });
    api.forgetPswGetCode(this.data.form.phone).then(res => {
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
  bindKeyInput: function(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({
      [key]: e.detail.value
    });
  },
  nextStep: function(e) {
    const { phone, code } = this.data.form;
    if (!(phone && mobileReg.test(phone))) {
      wx.showToast({
        title: '请输入有效手机号码',
        icon: 'none'
      });
      return;
    }
    if (!code) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      });
      return;
    }
    this.setData({
      loading: true
    });
    api.forgetPsw(this.data.form.code).then(res => {
      this.setData({
        loading: false
      });
      if (res.code === '1') {
        this.setData({
          current: this.data.current + 1 > 2 ? 2 : this.data.current + 1
        });
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none'
        });
      }
    });
  },
  nextStep2: function(e) {
    const { newPassword, repeatPassword } = this.data;
    if (
      !(newPassword && newPassword === repeatPassword && newPassword.length > 6)
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
    api.resetPassword(this.data.newPassword).then(res => {
      this.setData({
        loading: false
      });
      if (res.code === '1') {
        this.setData({
          current: this.data.current + 1 > 2 ? 2 : this.data.current + 1
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
  gotoLogin: function() {
    wx.navigateTo({
      url: '/pages/login/index'
    });
  }
});
