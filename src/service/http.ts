import axios from 'axios';
import { message } from 'antd';

let baseURL = '';
if (process.env.NODE_ENV === "development") {
    baseURL = "http://frp.sunmeta.top:2004";
  } else if (process.env.NODE_ENV === "production") {
    baseURL = "http://localhost:8080";
  } else {
    baseURL = "http://localhost:8080";
  }


/**
 * 创建axios实例
 */
const axiosInstance = axios.create({
    baseURL,
    timeout: 15000,
  });
  
  /**
   * 请求拦截
   */
  axiosInstance.interceptors.request.use(
    function (config) {
      // 打开 loading
    //   if (config.loading) {
    //     messageApi.open({
    //         type: 'loading',
    //         content: 'loding..',
    //         duration: 2.5,
    //       }).then(() => message.success('Loading finished', 2.5))

    //   }
  
    let userBaseUrl = window.localStorage.getItem("http_base_url");
    if (userBaseUrl) {
      config.url = userBaseUrl + config.url
    }
      return config;
    },
    function (error) {
      // 对请求错误做些什么
      return Promise.reject(error);
    },
  );
  
  /**
   * 响应拦截
   */
  axiosInstance.interceptors.response.use(
    function (response) {
      // 关闭 loading
    //   if (response.config.loading) {
    //     message.clear();
    //   }
  
      // 对响应数据做点什么
      if (response.data.code !== 0) {
        message.error(response.data.message);
      }
      return response.data;
    },
    function (error) {
      // 关闭 loading
    //   if (error.config.loading) {
    //     message.clear();
    //   }
  
      // console.log('error', error);
      // console.log('error.request', error.request);
      // console.log('error.config', error.config);
      // console.log('error.response', error.response);
      // console.log('error.message', error.message);
  
      // 对响应错误做点什么
      switch (error.response?.status) {
        case 400:
          error.message = '请求错误(400)';
          break;
        case 401:
          error.message = '未授权(401)';
          break;
        case 403:
          error.message = '拒绝访问(403)';
          break;
        case 404:
          error.message = '请求出错(404)';
          break;
        case 408:
          error.message = '请求超时(408)';
          break;
        case 500:
          error.message = '服务器错误(500)';
          break;
        case 501:
          error.message = '服务未实现(501)';
          break;
        case 502:
          error.message = '网络错误(502)';
          break;
        case 503:
          error.message = '服务不可用(503)';
          break;
        case 504:
          error.message = '网络超时(504)';
          break;
        case 505:
          error.message = 'HTTP版本不受支持(505)';
          break;
        default:
          error.message = `连接出错(${error.response?.status})!`;
      }
      message.error(error.message);
  
      return Promise.reject(error);
    },
  );
  
  export default axiosInstance;
  export const request = axiosInstance.request;