// pages/reportCenter/index.js
const api = require('../../utils/api.js');
const { IMG_URL } = require('../../config.js');
const { formatTime } = require('../../utils/util.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    bookList: [],
    areaIndex: [null, null, null],
    areaArray: [],
    industryKey: null,
    industries: [
      {
        val: '8ac169e6-4a3e-4291-af1c-e913ed89b6a5',
        name: '林业'
      },
      {
        val: '8df6dada-b3fa-46af-ba22-4a3472a95745',
        name: '农业'
      },
      {
        val: '59665c22-5faa-48a4-8b6e-5e4bd0a1d6bd',
        name: '国土'
      },
      {
        val: '85a62495-f98d-4cf3-8953-3715e050f00c',
        name: '耕地'
      },
      {
        val: '03529ee9-4ad6-4958-af36-c1dc63958ce9',
        name: '城市变化'
      },
      {
        val: 'ae711405-1e5f-4530-bcbd-f4d8867dc711',
        name: '地表温度'
      },
      {
        val: '35826340-b670-4349-a0e7-04af293dc56e',
        name: '植被分布'
      }
    ],
    infoHzCodeKey: null,
    infoHzCodes: [
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
    downloadStandardKey: null,
    downloadStandards: [
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
  },
  // 区域行改变绑定
  bindAreaColumnChange: function(e) {
    const { column, value } = e.detail;
    var data = {
      areaArray: this.data.areaArray,
      areaIndex: this.data.areaIndex
    };
    data.areaIndex[column] = value;
    const area = data.areaArray[column][value];
    this.setData({
      areaIndex: data.areaIndex
    });
    this.updateAreaList(area.adminId, column + 1);
  },
  // 区域值改变绑定
  bindAreaChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      areaIndex: e.detail.value
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
  onLoad: function(options) {
    this.updateAreaList('', 0);
  },
  onShow: function() {
    console.log(this.data.booksList);
    this.setData({
      loading: true
    });
    api.getReports().then(res => {
      console.log(res.booksList);
      this.setData({ bookList: this.formatListData(res.booksList) });
      this.setData({
        loading: false
      });
    });
  },
  // 获取区域省市县，获取上级id递归构造二维数组
  updateAreaList: function(fatherId, index) {
    let colIndex = this.data.areaIndex[index];
    colIndex === null && (colIndex = 0);
    if (index < 3) {
      api.getAreaList(fatherId).then(res => {
        const key = `areaArray[${index}]`;
        if (res.list) {
          this.setData({
            [key]: res.list
          });
          this.updateAreaList(
            res.list[colIndex]
              ? res.list[colIndex].adminId
              : res.list[0].adminId,
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
