import moment from 'moment';
import JSEncrypt from 'jsencrypt';
import CryptoJS from 'crypto-js';

// const key =
// 遥感地图网页应用 2021003154649392 私钥
// 'MIIEpQIBAAKCAQEAmGPwXSi1MjuIvEh0Gl75d62tTQF/vzMkFDuLjx5RJ/DiSntXbmVV3ZJjICNOKLaWCemHvBerJfXtDQUAJWVo8FwJJQrla3oGHQp38vUNtRLGQQkozzWeSslaXZc/cEDLBfjogzk4jojEXuFpgbzY0BJZg+KHh6k7TK/Tf6Zrn19fxVojeAx8njguIjlDbZAtnaNYlq3fYIVzPX3nd/xTQmLwHKjeuJ626i+zdo57oNKHOOStX/0Isf6y4rj8cdPrmxfWDw86vV1Pd378sKL0vejOrS6TLoYG8sMGk8Fi//ecXnY1068vYl2tQOIqHiZb8XGCFIYoNWefvHPsufqkQwIDAQABAoIBAQCAnfDTn7T2tZqdVwVu8HPbF6Gp2bcJF8++p9cNLwhODpffRySuzyZegNva1xFzeU8/BHQEQ3G2805ka7EI3wNnwjYRppWlVXLtddVxIHS2PCdJ4sInyNhVxIXZcfsf8f+ohcEwZ84dNr+OWO+kiU/wpVwZ3MqIrEOZYNi/5yT0d8jdNNMsDGeGwGzULN/eIqgiF9l3vbn4w79WoUTOll6yxC/8ZYa9TX8yFWGKjElmr6K/c2x2NuRpToQgYv5iqN6m1biUNmkoqQ3cbysGAKP2Vb7S9GEjI6Kcp3TwfyrE65s7pS0aU6lNfuqzjNuulRDnxAXP2+fHSOcZBFQSu7TpAoGBAOPO+9jbezq6eQ9seruN8UMriTiFRU02E+HNihCbM2Vvwbb4wet25dJYL4TqRT+CawQA7XQ85/8QCl0mpUOFDJa6agYSby2Eai2IDZ5KxvdDNXDuQv+R4Wh2TV3xjK4tyrUZhYGZZ8g1MrxuilvR7/gG41pl0X28aDHxzjWgV4JtAoGBAKs/sccl4QbINq2AUB/rWKFv2SNVMTpq13/PtRCeVe49Gin9SpEuYm5XD/0n9hNRDiYul8Hwcq1ff5O+bEi+UJyqyVDjJs82onhCJOY+hWkTcluQCkjKNqKyTciys0gsZorY8/oxzkZ7aBQSkhZ4+ReR8tf2Ti46QTB1ft/55xNvAoGBAKINb6JIH1UbqVqLdJNO2b1Kjwah5zaRrXsHV5uQi/MwmMCsHGZ/4eTLzqHidPhEshPbBQ+W9AHBS14QS6fIUbg3S4yeOHBMratOCUH9N6RVLwLyur5K6+n/nfGiDs0ozfYd/Za/pdAJ59mbWNkQcoAhhkGcBHZJPGWq+WG0egvRAoGBAJnLPTS17w7xNjHBf7P634E0etTBiNGG7HyLpHgFSvUHiPzWzmXuO1YO+HwJrHSSodtmksII2GSd1GxyYrs9uBXLR7tOFSeZUHYiKRNiaNwCK/zRMntGp6Sb70FkQ6B4x6rAxvQWUMN5xvHn760g/cvONkL/oBziEnObwdMSkxUfAoGAQ2zEYHRAas8lichIbcrmfvtBUSfAKIEJO+rXeNoxjEKPHRERlCVnAs/O5OmxbB+oZzyrK16+LGM+3jnDEf0kdT49cqkMK1n8CJR2W9MrbK8jMFZOR0XW7vQ0J0vnc5R6vobf3U4jFq8nVK3ehOUicVIqre6LEiHKVQUqC3y+Vl4=';
// 遥感地图网页应用 2021003154694648 私钥
// 'MIIEpQIBAAKCAQEA1N165ud87194oMhMT4oCsoF+DenzjhRMEo4WxlSbWsyGRExQh7MSZ+aZZS8RWDLSfy3VNpUhpYllDiGg/Ng2q6SE4inU2O5IBghBKWJoznld+0CiUCKFEFukRYtUszedHiN5rlfE4E/PsUF0RiV8VRCPMdsHsfQvwYJ54CAuFKKcD4FLHrBmHb7X7D569gGJYEyf4L5iBxLoFgoiMnUwoY2SZr4ge+kW94RvNuUCWHDDA8o5/Z8SMztotrwRE1utHgqbPSV1wIn1vppQs8tH2qp8m0s5lT11iEqoJ6NPNlglU6s/4p7CV4genTvXOPyGqVKxz1i29m2LebU0khSwzwIDAQABAoIBAQCyEOBp3kXV3HCFV2j2tIWTG93997JFLVeBwhjtKgOXjjXXVlubWMJR5kZ1rUz+Ee2idA3DDjfKSUge7STFvnzlUsfShZnHKnVXjnosC2WPK1nh/2yISogzaeXeQzLEhQZLGvQEUumfl0QvjIie0WbTpfmThB1I0PNOFj6rrV++482DNdOfIGPAjWb+Id32vbQxgzUtFNsSno85l4EFRZQ9hfXsljxRuDeA4VLUWo7ZpOztNVO95emhAWgWQ2S0/YNgVO04UVVfiCQSqa80HpNz4l+4WnCQEDKrOA4kY64h988g7MG1bN9uaV9zQ6u6wh/Ijb4vvIL/ShwaQHvWtE5RAoGBAPJFgPcyv7Eatg6WMM+bW5ihf6Q2x3KUvocAtnhjLb0DNGsewJGknCU0dE5BQN0TdbV3H1mncLaBOl7XFT2Rvgs0KdUzCBi60uyMtFSRnty/UarE5vdUH8pKWX+OniRcMr9nYD1k/CxWrBKfhOwi8rxgaIJkbIjzHWzwKbZoeEvXAoGBAODtZSKmBc83v5fRR4eSr0QPDzjvzEOZc/g5AOzKhJx+2d496t25bULuxWEsHonvZweLNZraM2wV/lM6wLbmEj1FYHvcuU9TvInceqCbKcXSCkZOpqyuUKJGQVHIAswno07cekp2SFB+1OABYSvEWqVeYg3rqzVjGqVrvuBae2PJAoGBAMTzJbVPhzAVk9zl0cZj+KFq4JYBhkAqlXywYqYZkkwut8VBWbDMjbddHhOjznQqZq1fqpe6m9Fx2p7Q4M6NlV4MSNmtw64+6kss00hQnUG9MknOCikUNUfBC2K78OmEHiklg8JFPw9YYkg9b9R7ULM8+JjPxL/MS6aM0owb/3c/AoGBAKXir2okY7h19xmywTxdlGFvcdyeDln0vLDe6a25lqAMdgYQSD2KWei5TFzkOwmjxKqtorU4JCCc/9rGRAcgG2eQ2R3ApfK5YR2Tu+TjSqWYyPcdXpOQY+uqQNZd2qJSwYCR3qc4IREs2Tb0DYRH5kp8F3kIzFYtZyOFGVtBoCrxAoGAdZnOWrUyXx6OJg98+TtV5HMkNIVbdGjjoJvmvxgXnABHKbyRjnP4WxARQiiBga/qh07+Ovo4EkbyWf5oqkogzY+F969A5zeSQCuJ7Gu6HzBdjcAIRzq8hDqBiFSskYBFz/Ohn8JL8Y757JXYgjur6AppOk4KElC0o/ZOXkPjg7k=';
// RSA 签名
const encrypt = new JSEncrypt();
// encrypt.setPrivateKey(key);

const AK = {
  appId: '2021003154694648', // 遥感地图网页应用
  key:
    'MIIEpQIBAAKCAQEA1N165ud87194oMhMT4oCsoF+DenzjhRMEo4WxlSbWsyGRExQh7MSZ+aZZS8RWDLSfy3VNpUhpYllDiGg/Ng2q6SE4inU2O5IBghBKWJoznld+0CiUCKFEFukRYtUszedHiN5rlfE4E/PsUF0RiV8VRCPMdsHsfQvwYJ54CAuFKKcD4FLHrBmHb7X7D569gGJYEyf4L5iBxLoFgoiMnUwoY2SZr4ge+kW94RvNuUCWHDDA8o5/Z8SMztotrwRE1utHgqbPSV1wIn1vppQs8tH2qp8m0s5lT11iEqoJ6NPNlglU6s/4p7CV4genTvXOPyGqVKxz1i29m2LebU0khSwzwIDAQABAoIBAQCyEOBp3kXV3HCFV2j2tIWTG93997JFLVeBwhjtKgOXjjXXVlubWMJR5kZ1rUz+Ee2idA3DDjfKSUge7STFvnzlUsfShZnHKnVXjnosC2WPK1nh/2yISogzaeXeQzLEhQZLGvQEUumfl0QvjIie0WbTpfmThB1I0PNOFj6rrV++482DNdOfIGPAjWb+Id32vbQxgzUtFNsSno85l4EFRZQ9hfXsljxRuDeA4VLUWo7ZpOztNVO95emhAWgWQ2S0/YNgVO04UVVfiCQSqa80HpNz4l+4WnCQEDKrOA4kY64h988g7MG1bN9uaV9zQ6u6wh/Ijb4vvIL/ShwaQHvWtE5RAoGBAPJFgPcyv7Eatg6WMM+bW5ihf6Q2x3KUvocAtnhjLb0DNGsewJGknCU0dE5BQN0TdbV3H1mncLaBOl7XFT2Rvgs0KdUzCBi60uyMtFSRnty/UarE5vdUH8pKWX+OniRcMr9nYD1k/CxWrBKfhOwi8rxgaIJkbIjzHWzwKbZoeEvXAoGBAODtZSKmBc83v5fRR4eSr0QPDzjvzEOZc/g5AOzKhJx+2d496t25bULuxWEsHonvZweLNZraM2wV/lM6wLbmEj1FYHvcuU9TvInceqCbKcXSCkZOpqyuUKJGQVHIAswno07cekp2SFB+1OABYSvEWqVeYg3rqzVjGqVrvuBae2PJAoGBAMTzJbVPhzAVk9zl0cZj+KFq4JYBhkAqlXywYqYZkkwut8VBWbDMjbddHhOjznQqZq1fqpe6m9Fx2p7Q4M6NlV4MSNmtw64+6kss00hQnUG9MknOCikUNUfBC2K78OmEHiklg8JFPw9YYkg9b9R7ULM8+JjPxL/MS6aM0owb/3c/AoGBAKXir2okY7h19xmywTxdlGFvcdyeDln0vLDe6a25lqAMdgYQSD2KWei5TFzkOwmjxKqtorU4JCCc/9rGRAcgG2eQ2R3ApfK5YR2Tu+TjSqWYyPcdXpOQY+uqQNZd2qJSwYCR3qc4IREs2Tb0DYRH5kp8F3kIzFYtZyOFGVtBoCrxAoGAdZnOWrUyXx6OJg98+TtV5HMkNIVbdGjjoJvmvxgXnABHKbyRjnP4WxARQiiBga/qh07+Ovo4EkbyWf5oqkogzY+F969A5zeSQCuJ7Gu6HzBdjcAIRzq8hDqBiFSskYBFz/Ohn8JL8Y757JXYgjur6AppOk4KElC0o/ZOXkPjg7k=',
};

const openAPIConfig: any = {
  gateway: 'http://openapi.stable.dl.alipaydev.com/gateway.do',
  timeout: 5000,
  charset: 'utf-8',
  version: '1.0',
  appId: '2021003154694648',
  camelcase: false,
};

export async function callByOpenAPI(
  method: string,
  // modelId: string,
  // version: string,
  // appId: string = '',
  bizContent: Object,
) {
  const params = sign(method, bizContent, openAPIConfig);
  const encodedParams = encodeParams(params);
  // console.log('encodedParams :>> ', encodedParams);
  return encodedParams;
}

/**
 * 签名
 * @description https://opendocs.alipay.com/common/02kf5q
 * @param {string} method 调用接口方法名，比如 alipay.ebpp.bill.add
 * @param {object} bizContent 业务请求参数
 * @param {object} config sdk 配置
 */
export function sign(method: string, bizContent: any = {}, config: any): any {
  const signParams = Object.assign({
    method,
    appId: config.appId || AK.appId,
    charset: config.charset,
    version: config.version,
    signType: 'RSA2',
    timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
    // appAuthToken: '202210BB64237396751c42aa9c225985256e2D92',
    // ws_service_url: 'mysearchgw-36.gz00b.dev.alipay.net:12200', // 可选，开发环境需要传，预发环境不需要传
  });

  encrypt.setPrivateKey(config.key || AK.key);

  if (bizContent) {
    signParams.bizContent = JSON.stringify(toSnakeCases(bizContent));
  }

  // params key 驼峰转下划线
  const deCamelizeParams = toSnakeCases(signParams);

  // 排序
  const signStr = Object.keys(deCamelizeParams)
    .sort()
    .map((key) => {
      let data = deCamelizeParams[key];
      if (Array.prototype.toString.call(data) !== '[object String]') {
        data = JSON.stringify(data);
      }
      return `${key}=${data}`;
    })
    .join('&');

  // console.log('signStr :>> ', signStr);

  // 计算签名
  const sign = RSAEncrypt(signStr);
  return Object.assign(deCamelizeParams, { sign });
}

function RSAEncrypt(signStr: string) {
  const start = Date.now();
  const encrypted = encrypt.sign(signStr, CryptoJS.SHA256, 'sha256');
  // console.log('encrypted :>> ', encrypted, Date.now() - start);
  return encrypted;
}

function toSnakeCases(params: any) {
  const out: { [key in string]: any } = {};
  Object.keys(params).forEach((key) => {
    const newKey = key.replace(
      /([A-Z])/g,
      (match) => '_' + match.toLowerCase(),
    );
    out[newKey] = params[key];
  });
  return out;
}

export function encodeParams(params: any) {
  const out: { [key in string]: any } = {};
  Object.keys(params).forEach((key) => {
    out[key] = encodeURIComponent(params[key]);
  });
  return out;
}
