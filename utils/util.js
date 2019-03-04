const formatTime = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return (
    [year, month, day].map(formatNumber).join('/') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  );
};

const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : '0' + n;
};

module.exports = {
  formatTime: formatTime,
  // 由于页面跳转放入url编译错误，将?用@代替，=用%代替，&用*代替
  createWebUrl: function(pageUrl, webUrl, param) {
    let newUrl = pageUrl + '?url=' + webUrl;
    let params = [];
    for (let key in param) {
      params.push((`@${key}%${param[key]}`));
    }
    return newUrl + params.join('#');
  },
  mobileReg: /(^0{0,1}1[3|4|5|7|8][0-9]{9}$)/
};
