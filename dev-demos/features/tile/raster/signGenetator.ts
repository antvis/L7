import moment from 'moment';
import JSEncrypt from 'jsencrypt';
import CryptoJS from 'crypto-js';

const key =
  'MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDOB+7d4u08HvfvzynZGZ1FMfKi/4kravQbBd+6O38Yn/b8AfOy+vHHm6CRFOwpAGT503SliRJgSBs6vCwrdAXZctYRzKkU7l4gCFMG8rL0kX1KWzYi3sQlsBylPay7cXVcjZiBNrxI752753L1C+JFP6yfbOSV2xn3xB4KlMRtLDcDYWHa2ffpS9nuFzY9YF5zt+63yxUhhQxe9ISeS1K+1YGrQCemjZG8908e5kuq/ywcL/lhHB4BJ8xEp0u9OuyUTCnJy84Y/ifTsxog8BXuDRPyzEChplssNUjH1RgHjpeCOPImypGuvbXq47KhEEPUW2qho5zIX0+UcdsZJ0XRAgMBAAECggEAXZLCzSnUf1q9VsArDHwSrquZvKf8X6jKxz8qtoVxGvkEDr7ANQi+KN8o1NvAynpwYfrE3q3bl7kIDOwLz4x5X6JFUX43SNdeDoRZWS1/U46EbfHxK3MreMZ8rBvPyK4mFGwG2KDIcQPLCt16m4rTMIpT13B4fQsuxxXeYwXgFIiQpSbVdWadnoZvZRwDeJF3p2kMOx9THnaMNnVakBuSKgpRd18tq4MnVRLreNk5rdtEvUtRtdINUgIAjCkFISw3XgeodRYCYG04EJtO7CEQNAzirZTUXaRjfFa1WXu33xrYyYAJdtYP/Q0fxY60xL8hcAAc2Zhaee6IsJPnuYPcBQKBgQDq549qQ/DzZV7FoIv51VIhGoJOwAI1XJtTvKBtzfjX4oKDmmjOzU4tVgCryxxU53IPwd8oXmvNKJkXVH4q8h4ILwBLBiaSEPtuIjcVSbo7Z99xY2Vt2z/17h1pFLYdJSdP+yDs7iDQKZe7BmdduOys9bRr+OCrVwDerEP/oEziewKBgQDgiJJtsT60z7cM5Jyc7VvF6VnsRZuQQesicJ7AbJ8k7zCjCeCv4/LLr6VUsWs2yW0KzXG5A2nJ70uBNBe+W08vOD7jNFPvyEQEh4+39IfBWVDzq13lcW1X//OU3zUoftXiqgxxtABVB6Mly6skex4KUN1uDt4I5P8oNnvCiPc9IwKBgQDQAgaz8b++uAgI9lac/3H/kErNUydhe0SsDL7/HMH64T/zK1sdrR1J9fsYJP5MjLorC+EBDUNmY0nVJ+OlQcqoMn6O8L5c357VcoTWW/gGPL/W105szhZAPv9aGpX9DvZV06nfRCpYSkxqt4v2qRcjPVvrtHG2J4/EnkSEar1KWwKBgQCxeuKbuD3DuGiN1WsCFBC1uMUuoLrdZW2SVIj3uyR0kmjUhutGvRze6iD6eB8yODdsEYax4sPNLcx1/ZJDEnPd9EypVWR/pcI1/l2Y374rFAmMAkn/IhB3PcbxRxoCv3cbaqTZf5m/nIDWUE4gUP0m1FKjOzdAupoB1EcxNwiPFwKBgQCBYKck0H/Yl3Z7RHAjpxsoV5gZnljxU0WDa7/QW0xr/c2SBcFY1tr7sV3wiz3bEo35Zou7xd++PCetCmd+5TaQ0nNwye1L75q6x9spzb64WHMtuXfZdCB9nWcKtVx1iFNpaqY6EM8poJ2/5kPTyu+qGm7XTEJNg4gpXEtGjhLWOw==';

// RSA 签名
const encrypt = new JSEncrypt();
encrypt.setPrivateKey(key);

const openAPIConfig: any = {
  gateway: 'http://openapi.stable.dl.alipaydev.com/gateway.do',
  timeout: 5000,
  charset: 'utf-8',
  version: '1.0',
  appId: '2021004109641066',
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
    appId: config.appId,
    charset: config.charset,
    version: config.version,
    signType: 'RSA2',
    timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
    // ws_service_url: 'mysearchgw-pre.alipay.com:12200', // 可选，开发环境需要传，预发环境不需要传
    ws_service_url: 'mysearchgw-36.gz00b.dev.alipay.net:12200', // 可选，开发环境需要传，预发环境不需要传
  });

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
