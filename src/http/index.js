import service from './service'
import { Toast, Indicator } from 'mint-ui'

function request (method, url, data = {}) {
  Indicator.open()
  return new Promise((resolve, reject) => {
    service({
      method,
      url,
      data
    })
      .then(res => {
        Indicator.close()
        if (res.status === 200) {
          resolve(res.data)
        } else {
          Toast(res.data.message)
        }
      })
      .catch(error => {
        Indicator.close()
        reject(error.message)
        Toast(error.message)
      })
  })
}

const Http = {
  get: url => request('get', url),
  post: (url, data) => request('post', url, data),
  put: (url, data) => request('put', url, data),
  patch: (url, data) => request('patch', url, data),
  delete: (url, data) => request('delete', url, data)
}

export default Http
