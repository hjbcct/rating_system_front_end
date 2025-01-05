import axios, { type InternalAxiosRequestConfig } from 'axios'
// import { showNotify } from 'vant';
// import 'vant/es/notify/style'

// 错误码
// enum errCode {
//     SERVER_INTERNAL_ERROR = 500
// }

// 后端响应结构
type Response = {
  code: number
  data: any
}

const instance = axios.create({
  baseURL: '/',
  timeout: 50000000,
})
console.log('import.meta.env.VITE_APP_ENV', import.meta.env.VITE_APP_ENV)
if (import.meta.env.VITE_APP_ENV === 'development' || import.meta.env.VITE_APP_ENV === 'local') {
  instance.defaults.baseURL = 'http://localhost:6657/'
}
if (import.meta.env.VITE_APP_ENV === 'production') {
  instance.defaults.baseURL = 'http://localhost:6657/'
}
// 添加请求拦截器
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // console.log('axios config:',config)
    // 在发送请求之前做些什么
    return config
  },
  (error) => {
    // 请求错误
    return Promise.reject(error)
  },
)

// 添加响应拦截器, 进行错误处理
instance.interceptors.response.use(
  function (response) {
    // console.log('axios response', response)
    // 返回响应data响应体
    const res: Response = response?.data
    console.log('axios response:', res)
    if (Number(res.code) !== 200) {
      // showNotify({ type: 'warning', message: res.data.msg  });
      console.log('server response error:', res.data.msg)
      return
    }
    return res.data
  },
  function (error) {
    // showNotify({ type: 'warning', message: '服务器内部故障'  });
    // 响应错误
    console.log('axios response error:', error)
    return Promise.reject(error)
  },
)

const get = async function <T>(url: string, data?: object): Promise<T> {
  return await instance({
    method: 'get',
    url,
    params: data,
  })
}

const post = async function <T>(url: string, data?: object): Promise<T> {
  console.log('post data:', data)
  return await instance({
    method: 'post',
    url,
    data,
  })
}

const put = async function <T>(url: string, data?: object): Promise<T> {
  return await instance({
    method: 'put',
    url,
    data,
  })
}

const delete_ = async function <T>(url: string, data?: object): Promise<T> {
  return await instance({
    method: 'delete',
    url,
    params: data,
  })
}

export { get, post, put, delete_ }
