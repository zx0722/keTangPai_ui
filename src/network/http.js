import axios from 'axios'
import qs from 'qs'

axios.defaults.baseURL = "http://172.26.172.1:8046";
axios.defaults.timeout = 3000;
axios.defaults.withCredentials = true;

axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';


axios.interceptors.request.use(function (config) {
  if (localStorage.getItem('myToken')) {
    config.headers.Authorization = localStorage.getItem('myToken')
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});

axios.interceptors.response.use(res => {
  if (res.headers.token != undefined) {
    localStorage.setItem('myToken', res.headers.token)
  }
  return res;
}, err => {
  return Promise.reject(err);
});

function baseURL() {
  return axios.defaults.baseURL
}

//封装get请求
function get(url, params) {

  return new Promise(
    (resolve, reject) => {
      axios.get(url, { params: params })
        .then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err.data)
        })
    }
  )
}

//封装post请求
function post(url, data) {
  return new Promise(
    (resolve, reject) => {

      axios.post(url, JSON.stringify(data))   //将json数据编译成字符串
        .then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err.data)
        })
    }
  )
}

 //封装post请求 form-url类型
function postForm(url, data) {
  return new Promise(
    (resolve, reject) => {

      axios.post(url, qs.stringify(data),
        {
          headers: {
            'content-type': 'application/x-www-form-urlencoded'
          }
        }
      ).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
    }
  )
}


 //封装post请求 form-data类型
 function postFormData(url, data) {
  return new Promise(
    (resolve, reject) => {

      axios.post(url,data,
        {
          headers: {
            'content-type': 'multipart/form-data'
          }
        }
      ).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
    }
  )
}

//封装put请求
function put(url, data) {
  return new Promise(
    (resolve, reject) => {
      axios.put(url, JSON.stringify(data))
        .then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err.data)
        })
    }
  )
}


//封装delete请求
function axios_delete(url, data) {
  return new Promise(
    (resolve, reject) => {
      axios.delete(url, { params: data })
        .then(res => {
          console.log("封装信息的的res", res)
          resolve(res.data)
        }).catch(err => {
          reject(err.data)
        })
    }
  )
}

export default {
  baseURL,
  get,
  post,
  put,
  axios_delete,
  postForm,
  postFormData,
}