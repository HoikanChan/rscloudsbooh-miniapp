const request = require('./request.js');

module.exports = {
  // 查询获取区域，省市乡，为树状结构，
  getAreaList: fatherId =>
    fatherId
      ? request('area/getAreaList?fatherId=' + fatherId)
      : request('area/getAreaList'),
  // 查询用户信息
  getUserInfo: () =>
    request('user/getUserInfo?ticket=' + getApp().globalData.ticket),
  // 查询云报列表
  getReports: () => request('reportgetContent'),
  // 根据参数查询云报
  queryReports: (industry, params) =>
    request('reportgetContent/' + industry, params),
  // 忘记密码获取手机验证码
  forgetPswGetCode: phone =>
    request(
      '/usercenter/forgetLoginPassword_sendMessage.htm',
      { phone, r: 1171 },
      'GET',
      'mart'
    ),
  // 忘记密码检查手机验证码
  forgetPsw: scode =>
    request(
      '/usercenter/forgetLoginPassword_checkCode.htm',
      { scode },
      'GET',
      'mart'
    ),
  // 忘记密码重设密码
  resetPassword: newPassword =>
    request(
      '/usercenter/forgetLoginPassword_resetPassword.htm',
      { newPassword, r: 1985 },
      'GET',
      'mart'
    ),
  // 注册获取手机验证码
  registerGetCode: ({ phone, imageCode }) =>
    request(
      '/usercenter/sendCodeMessage.htm',
      { phone, imageCode },
      'GET',
      'mart'
    ),
  // 注册
  register: form =>
    request(
      '/usercenter/userRegister.htm',
      { ...form, userEmail: '', userCompany: '', userAddress: '', rephone: '' },
      'GET',
      'mart'
    )
};
