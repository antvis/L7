// const SDFCommonWordsKey = '_AMap_sdf_com_words';

// /**
//  * SDF 常用字获取/存储/check
//  *
//  */
// const SDFCommonWords = {

//   store() {

//   },

//   /**
//    *  检查一个字符是否在常用字中
//    * @param {*} charcode  汉字
//    */
//   check(charcode) {
//     const range = this.range || [];
//     const info = this.info || {};

//     if (typeof charcode !== 'number') {

//       charcode = charcode.substr(0).charCodeAt(0);
//     }

//     for (let i = 0; i < range.length; i++) {
//       const curRange = range[i];
//       const [ rangeStart, rangeEnd ] = curRange.split('-');

//       if (charcode >= rangeStart && charcode <= rangeEnd) {

//         const curInfo = info[curRange] && info[curRange].info || {};

//         if (curInfo[charcode]) {

//           return true;
//         }
//       }
//     }

//     return false;
//   },

//     /**
//      * 获取纹理和位置信息
//      * @param list
//      * @param cb
//      */
//   getImagesAndInfo(list, cb) {
//     const range = this.range;


//   },

//   loadCanvas(url, range, done) {

//     try {
//       const xhr = new XMLHttpRequest();
//       xhr.open('GET', url);

//             // 直接用 blob 格式 load 图片文件，方便直接转换成 base64
//             // 转成 base64 便于存储
//             // 使用 canvas 转换 base64 容易有损
//       xhr.responseType = 'blob';
//       xhr.onerror = function() {
//         done({ code: 0 });
//       };

//       xhr.onload = function() {

//         if (xhr.status === 200) {
//           const reader = new FileReader();

//           reader.onload = () => {

//             done(reader.result, range);
//           };

//           reader.readAsDataURL(xhr.response);
//         } else {
//           done({ code: 0 });
//         }
//       };

//       xhr.send();
//     } catch (err) {

//       done({ code: 0 });
//     }
//   },

//   loadImages(urls = []) {
//     const deferred = $.Deferred();
//     const totalNumbers = urls.length;
//     const localInfo = this.info;
//     let loadPicNum = 0;

//     for (let i = 0; i < urls.length; i++) {
//       const { url, range } = urls[i];

//       this.loadCanvas(url, range, (base64, range) => {

//                 // image to base64
//         loadPicNum++;

//         !localInfo[range] && (localInfo[range] = {});

//         localInfo[range].pic = base64;

//         this.info = localInfo;

//                 // todo: temp 暂时用 localstorage 存储，因为数据比较大，最好使用 indexDB
//         localStorage.setItem(SDFCommonWordsKey, JSON.stringify(localInfo));

//         if (loadPicNum === totalNumbers) {

//           deferred.resolve();
//         }
//       });
//     }

//     return deferred;
//   },

//   loadInfo(urls) {
//     const deferred = $.Deferred();
//     const totalNumbers = urls.length;
//     const localInfo = this.info;
//     let loadInfoNum = 0;

//     for (let i = 0; i < urls.length; i++) {
//       const { url, range } = urls[i];

//       $.ajax({
//         url,
//         dataType: 'json',
//         success: data => {
//           loadInfoNum++;

//           !localInfo[range] && (localInfo[range] = {});

//           localInfo[range].info = data;

//           this.info = localInfo;

//           localStorage.setItem(SDFCommonWordsKey, JSON.stringify(localInfo));

//           if (loadInfoNum === totalNumbers) {

//             deferred.resolve();
//           }
//         },
//         error: () => {

//         }
//       });
//     }

//     return deferred;

//   },

//   getTotalAssets(info, cb) {
//     const { range = [], urlPrefix } = info;
//     const picUrls = [];
//     const infoUrls = [];

//     this.range = range;

//     for (let i = 0; i < range.length; i++) {
//       const curRange = range[i];
//       const baseUrl = urlPrefix + curRange;
//       const picUrl = baseUrl + '.png';
//       const infoUrl = baseUrl + '.json';

//       picUrls.push({ range: curRange, url: picUrl });
//       infoUrls.push({ range: curRange, url: infoUrl });
//     }

//     const imageDeferred = this.loadImages(picUrls);
//     const infoDeferred = this.loadInfo(infoUrls);

//     $.when(imageDeferred, infoDeferred)
//             .then(() => {

//                 // all info load complete
//                 // console.log("all info load complete", "   -- ", 1);
//               cb && cb(this.info);
//             }, () => {

//                 // fail
//             });
//   },
//     // 获取数据
//   getData(cb) {

//     if (!_.isEmpty(this.info)) {

//       cb && cb(this.info);
//     } else {

//       this.getRemoteData(cb);
//     }
//   },

//     /**
//      * 从服务获取数据，什么时候强制去取一回数据？过期？
//      * @param cb
//      */
//   getRemoteData(cb) {
//     const self = this;

//     $.ajax({
//       url: '/getcommonwords',
//       dataType: 'json',
//       success: data => {

//         if (data.code == 1) {

//           const info = data.data;

//           self.getTotalAssets(info, cb);
//         }
//       }
//     });
//   },

//   destroy() {

//   },

//   init() {
//     let info = localStorage.getItem(SDFCommonWordsKey);
//     this.range = [];
//     this.info = {};

//     if (info) {
//       info = JSON.parse(info);
//       this.range = Object.keys(info);
//       this.info = info;
//     }

//     this.info = info || {};
//   }
// };
// export default SDFCommonWords;
