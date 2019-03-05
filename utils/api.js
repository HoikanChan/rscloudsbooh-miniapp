const request = require('./request.js');

module.exports = {
  getAreaList: fatherId =>
    fatherId
      ? request('area/getAreaList?fatherId=' + fatherId)
      : request('area/getAreaList'),
  getUserInfo: () => request('user/getUserInfo'),
  getReports: () => request('reportgetContent'),
  queryReports: (industry, params) =>
    request('reportgetContent/' + industry, params)
};
