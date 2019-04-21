// pages/login/index.js
const { FORGET_PSW_URL } = require('../../config.js');
const { createWebUrl } = require('../../utils/util');
const { hex_md5 } = require('../../utils/md5');
const request = require('../../utils/request.js');
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    form: {
      contact: null,
      password: null
    },
    forgetPswUrl: FORGET_PSW_URL,
    loading: false
  },
  foregePsw: function() {
    wx.navigateTo({
      url: '/pages/forgetPsw/index'
    });
  },
  register: function() {
    wx.navigateTo({
      url: '/pages/register/index'
    });
  },
  formSubmit: function() {
    if (!this.validateForm()) {
      return false;
    } else {
      this.setData({
        loading: true
      });
      wx.setStorageSync(
        'JSESSIONID',
        ''
      )
      request('booksUserLogin', {
        contact: this.data.form.contact,
        password: hex_md5(this.data.form.password),
        remberMe: false
      })
        .then(res => {
          this.setData({
            loading: false
          });
          if (res.code !== '1001') {
            wx.showToast({
              title: res.msg,
              icon: 'none'
            });
          } else {
            app.globalData.ticket = res.st;
            wx.navigateBack();
          }
        })
        .catch(res => {
          this.setData({
            loading: false
          });
          wx.showToast({
            title: res.msg,
            icon: 'none'
          });
        });
    }
  },
  validateForm: function() {
    const { contact, password } = this.data.form;
    let errMsg = '';
    if (!password) {
      errMsg = '请输入密码';
    }
    if (!contact) {
      errMsg = '请输入帐号';
    }
    if (errMsg) {
      wx.showToast({
        title: errMsg,
        icon: 'none'
      });
      return false;
    } else {
      return true;
    }
  },
  // 频率，行业选择
  bindKeyInput: function(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({
      ['form.' + key]: e.detail.value
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {}
});
