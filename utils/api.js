const request = require('./request.js');

module.exports = {
  getAreaList: fatherId =>
    fatherId
      ? request('area/getAreaList?fatherId=' + fatherId)
      : request('area/getAreaList'),
  getUserInfo: () => request('user/getUserInfo'),
  getReports: () => request('reportgetContent'),
  queryReports: params => request('reportgetContent', params)
};
