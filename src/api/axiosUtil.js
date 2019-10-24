import axios from "axios"; // 引入axios
import router from "@/router.js";
//import qs from "qs"; // 引入qs模块，用来序列化post类型的数据
//import { Loading /*, Message */ } from "element-ui";

// export const baseUrl = {
//   userUrl: "http://127.0.0.1:8071/",
//   blogUrl: "http://127.0.0.1:8072/"
// };

//设置默认请求地址    目前是设置的网关服务器
axios.defaults.baseURL = "http://localhost:8762/";
//axios.defaults.baseURL = "http://172.31.14.147:8762/";
//设置请求超时
axios.defaults.timeout = 10000;
//post请求头
axios.defaults.headers.post["Content-Type"] = "application/json; charset=utf-8";
//"application/x-www-form-urlencoded;charset=UTF-8";
//"application/json; charset=utf-8";

// 响应拦截器
axios.interceptors.response.use(
  response => {
    // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
    // 否则的话抛出错误
    //console.log(response.status);
    if (response.status === 200) {
      return Promise.resolve(response);
    } else if (response.status === 401) {
      router.$router.push({ path: "/u/login" });
      return Promise.reject(response);
    } else {
      return Promise.reject(response);
    }
  },
  // 服务器状态码不是2开头的的情况
  // 这里可以跟你们的后台开发人员协商好统一的错误状态码
  // 然后根据返回的状态码进行一些操作，例如登录过期提示，错误提示等等
  // 下面列举几个常见的操作，其他需求可自行扩展
  error => {
    console.log(error.response.status);
    if (error.response.status) {
      switch (error.response.status) {
        // 401: 未登录
        // 未登录则跳转登录页面，并携带当前页面的路径
        // 在登录成功后返回当前页面，这一步需要在登录页操作。
        case 401:
          router.replace({
            path: "/u/login",
            query: {
              redirect: router.currentRoute.fullPath
            }
          });
          break;

        // 403 token过期
        // 登录过期对用户进行提示
        // 清除本地token和清空vuex中token对象
        // 跳转登录页面
        case 403:
          //   Toast({
          //     message: "登录过期，请重新登录",
          //     duration: 1000,
          //     forbidClick: true
          //   });
          // 清除token
          localStorage.removeItem("token");
          //store.commit("loginSuccess", null);
          // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
          setTimeout(() => {
            // router.replace({
            //   path: "/login",
            //   query: {
            //     redirect: router.currentRoute.fullPath
            //   }
            // });
          }, 1000);
          break;

        // 404请求不存在
        case 404:
          //   Toast({
          //     message: "网络请求不存在",
          //     duration: 1500,
          //     forbidClick: true
          //   });
          break;
        // 其他错误，直接抛出错误提示
        default:
        //   Toast({
        //     message: error.response.data.message,
        //     duration: 1500,
        //     forbidClick: true
        //   });
      }
      return Promise.reject(error.response);
    }
  }
);

//axios.get()方法和axios.post()在提交数据时参数的书写方式还是有区别的。
//区别就是，get的第二个参数是一个{}，然后这个对象的params属性值是一个参数对象的。而post的第二个参数就是一个参数对象。
export function get(url, params, headers) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params,
        headers: headers
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}

export function getImg(url, params, headers) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params,
        responseType: "arraybuffer",
        headers: headers
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}

//post 会出现接受不到参数问题 需要qs.stringify()序列化params
export function post(url, params, headers) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, params, headers) //使用qs.stringify()序列化params
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}

export function setHeader(headername, headervalue) {
  axios.defaults.headers.common[headername] = headervalue;
}
