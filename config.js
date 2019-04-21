const HOST = 'https://yunbao.rscloudmart.com/';
// const HOST = 'http://192.168.15.226/rscloud-books-web/';
const MART_HOST='https://www.rscloudmart.com/';
const BOOK_HOST = HOST + 'books/booksDtail';
const BOOK_DOWNLOAD_HOST = HOST + 'pdfDownload/';
const IMG_URL = MART_HOST+'image/';
const IMGCODE_URL = MART_HOST+'usercenter/registerImagesCode.htm';
// 轮播图
const CAROUSEL_URL = HOST + '/images/banner.png';
const HELPCENTER_URL = HOST + 'help';

module.exports = {
  HOST: HOST,
  MART_HOST: MART_HOST,
  IMG_URL: IMG_URL,
  CAROUSEL_URL: CAROUSEL_URL,
  IMGCODE_URL : IMGCODE_URL ,
  BOOK_HOST: BOOK_HOST,
  BOOK_DOWNLOAD_HOST: BOOK_DOWNLOAD_HOST,
  HELPCENTER_URL: HELPCENTER_URL
};
