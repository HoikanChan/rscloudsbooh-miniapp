//index.js
//获取应用实例
const app = getApp();
const request = require('../../utils/request.js');
const { formatTime, debounce } = require('../../utils/util.js');
const { IMG_URL, CAROUSEL_URL } = require('../../config.js');
Page({
  data: {
    loading: false,
    hotCurrent: 0,
    newCurrent: 0,
    areaCurrent: 0,
    hotTotal: 0,
    newTotal: 0,
    areaTotal: 0,
    hotBooksList: [],
    newBooksList: [],
    areaBooksList: [],
    banner: [CAROUSEL_URL, CAROUSEL_URL, CAROUSEL_URL]
  },
  // 点击查看云报
  viewBook: function({ currentTarget }) {
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
  // 点击下载云报
  downloadBook: function({ currentTarget }) {
    console.log(currentTarget.dataset.bookid);
    const id = currentTarget.dataset.bookid;
    if (id) {
      wx.navigateTo({
        url:
          '/pages/downloadBook/downloadBook?id=cde5bcb9-132b-4570-971a-3c8e5c0b405e'
      });
    }
  },
  // 滑动云报
  swiperChange: function(e) {
    const key = e.currentTarget.dataset.key;
    console.log(e);
    this.setData({
      [key + 'Current']: e.detail.current
    });
  },
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
  onLoad: function() {
    this.setData({
      loading: true
    });
    request('getIndexContent').then(res => {
      console.log(res);
      this.setData({
        loading: false,
        hotBooksList: this.formatListData(res.hotBooksList),
        newBooksList: this.formatListData(res.newBooksList),
        areaBooksList: this.formatListData(res.areaBooksList),
        hotTotal: res.hotBooksList.length,
        newTotal: res.newBooksList.length,
        areaTotal: res.areaBooksList.length
      });
    });
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    });
  },
  // 搜索云报
  inputChange: debounce(function(e) {
    const val = e.detail.value;
    if(val){
      app.globalData.keyword = val
      wx.switchTab({
        url: '/pages/reportCenter/index'
      });
    }
  }, 500)
});
