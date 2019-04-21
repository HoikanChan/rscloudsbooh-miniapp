// pages/reportCenter/index.js
const api = require('../../utils/api.js');
const {
  IMG_URL
} = require('../../config.js');
const {
  formatTime,
  debounce
} = require('../../utils/util.js');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    bookList: [],
    areaIndex: ['', '', ''],
    areaArray: [],
    keyword: '',
    industryKey: '',
    industries: [{
        val: '',
        name: '全部'
      },
      {
        val: 'tdly',
        name: '土地利用'
      },
      {
        val: 'ly',
        name: '林业'
      },
      {
        val: 'ny',
        name: '农业'
      },
      {
        val: 'gt',
        name: '国土'
      },
      {
        val: 'sdfasdf',
        name: '耕地'
      },
      {
        val: 'adaf',
        name: '城市变化'
      },
      {
        val: 'opo',
        name: '地表温度'
      },
      {
        val: 'were',
        name: '植被分布'
      }
    ],
    infoHzCodeKey: '',
    infoHzCodes: [{
        val: '',
        name: '全部'
      },
      {
        val: 6,
        name: '年报'
      },
      {
        val: 7,
        name: '半年报'
      },
      {
        val: 1,
        name: '季报'
      },
      {
        val: 2,
        name: '双月报'
      },
      {
        val: 3,
        name: '月报'
      },
      {
        val: 4,
        name: '旬报'
      },
      {
        val: 5,
        name: '周报'
      }
    ],
    downloadStandardKey: '',
    downloadStandards: [{
        val: '',
        name: '全部'
      },
      {
        val: 0,
        name: '免费下载'
      },
      {
        val: 1,
        name: '付费下载'
      },
      {
        val: 2,
        name: '付费阅读'
      }
    ]
  },
  // 频率，行业选择
  bindPickerChange: function(e) {
    const valtype = e.currentTarget.dataset.valtype;
    this.setData({
      [valtype + 'Key']: e.detail.value
    });
    this.updateBookList();
  },
  // 区域值改变绑定
  bindProviceChange: function(e) {
    const value = e.detail.value;
    this.setData({
      'areaIndex[0]': value,
      'areaIndex[1]': ''
    });
    const area = this.data.areaArray[0][value];
    this.updateAreaList(area.adminId, 1);
    this.updateBookList();
  },
  bindCityChange: function(e) {
    const value = e.detail.value;
    this.setData({
      'areaIndex[1]': value
    });
    this.updateBookList();
  },
  goToCustomize: function(e) {
    wx.switchTab({
      url: '/pages/customizeReport/customizeReport'
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    this.updateAreaList('', 0);
    this.setData({
      loading: true
    });
    api.getReports().then(res => {
      this.setData({
        bookList: this.formatListData(res.booksList)
      });
      this.setData({
        loading: false
      });
    });
  },
  onShow: function() {
    const {
      keyword,
      areaCode
    } = app.globalData;
    app.globalData.keyword = '';

    if (keyword) {
      this.reset();
      this.setData({
        keyword: keyword || '',
      });
      this.updateBookList();
      return;
    }
    if (areaCode) {
      if (this.data.areaArray[0]) {
        this.queryByArea()
      }else{
        setTimeout(this.queryByArea,500)
      }
    }
  },
  queryByArea: function(){
    const {
      areaCode
    } = app.globalData;
    if (this.data.areaArray[0]) {
      let index;
      this.data.areaArray[0].find((item, i) => {
        if (item.adminId === areaCode) {
          index = i
          return true
        } else {
          return false
        }
      })
      this.setData({
        'areaIndex[0]': index
      })
      app.globalData.areaCode = '';
      this.updateBookList();
      return;
    }else{
      setTimeout(this.queryByArea, 500)
    }
  },
  reset: function() {
    this.setData({
      areaIndex: ['', '', ''],
      industryKey: '',
      downloadStandardKey: '',
      infoHzCodeKey: ''
    })
  },
  inputChange: debounce(function(e) {
    const keyword = e.detail.value;
    this.setData({
      keyword
    });
    this.updateBookList();
  }, 500),
  updateBookList: function() {
    this.setData({
      loading: true
    });
    const {
      areaIndex,
      areaArray,
      industryKey,
      industries,
      infoHzCodeKey,
      infoHzCodes,
      downloadStandardKey,
      downloadStandards,
      keyword
    } = this.data;
    const area =
      areaIndex[1] && areaArray[1][areaIndex[1]].adminId ?
      areaArray[1][areaIndex[1]].adminId :
      areaIndex[0] ?
      areaArray[0][areaIndex[0]].adminId :
      '';
    let industry = industries[industryKey] ?
      industries[industryKey].val :
      'report';
    api
      .queryReports(industry, {
        keyword,
        area,
        infoHzCode: infoHzCodeKey && infoHzCodes[infoHzCodeKey].val,
        downloadStandard: downloadStandardKey && downloadStandards[downloadStandardKey].val
      })
      .then(res => {
        this.setData({
          loading: false,
          bookList: this.formatListData(res.booksList)
        });
      });
  },
  // 点击查看云报
  viewBook: function({
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
  // 获取区域省市县，获取上级id递归构造二维数组
  updateAreaList: function(fatherId, index) {
    let colIndex = this.data.areaIndex[index];
    colIndex === null && (colIndex = 0);
    if (index < 2) {
      api.getAreaList(fatherId).then(res => {
        const key = `areaArray[${index}]`;
        if (res.list) {
          res.list.unshift({
            adminId: '',
            name: '全部'
          });
          this.setData({
            [key]: res.list
          });
          this.updateAreaList(
            res.list[colIndex] ?
            res.list[colIndex].adminId :
            res.list[0].adminId,
            ++index
          );
        } else {
          return;
        }
      });
    } else {
      return;
    }
  }
});