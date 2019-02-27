# 移动端开发框架的搭建

## 添加UI框架
>移动端使用vant和mint-ui
1. 安装
    ```
    npm i vant mint-ui
    ```
2. vant需要在main.js里做全局配置
    ```
    import Vant from 'vant' //导入组件库

    import 'vant/lib/index.css' //引入样式文件

    Vue.use(Vant)
    ```
3. 根据vant文档做Rem 适配，由于vant的rootValue为37.5，而我们自己的rootValue为75，解决方式如下
    ```
    // postcss.config.js

    const autoprefixer = require('autoprefixer')
    const pxtorem = require('postcss-pxtorem')
    module.exports = ({ file }) => {
      let rootValue
      if (file && file.dirname && file.dirname.indexOf('vant') > -1) {
        rootValue = 37.5
      } else {
        rootValue = 75
      }

      return {
        plugins: [
          autoprefixer(),
          pxtorem({
            rootValue: rootValue,
            propList: ['*'],
            minPixelValue: 1
          })
        ]
      }
    }
    ```
4. 使用vw实现移动端适配  **该开发框架使用vw方案**
    >使用flexible.js适配移动端的缺陷
    >>- 相比vw方案，要导入文件
    >>- flexible要监听窗口变化，消耗性能
    >>- 当页面引入ifram标签，里面的内容会受flexible影响导致样式变形

    >几乎所有的手机浏览器都支持vw
    
    ```
    // postcss.config.js

    const autoprefixer = require('autoprefixer')
    const pxtovw = require('postcss-px-to-viewport')
    module.exports = ({ file }) => {
      let vwUnit
      if (file && file.dirname && file.dirname.indexOf('vant') > -1) {
        vwUnit = 375
      } else {
        vwUnit = 750
      }

      return {
        plugins: [
          autoprefixer(),
          pxtovw({
            viewportWidth: vwUnit,
            minPixelValue: 1
          })
        ]
      }
    }
    ```
5. 具体使用方式参照：[vant文档](https://youzan.github.io/vant/#/zh-CN/intro)，[mint-ui文档](https://mint-ui.github.io/docs/#/zh-cn2)

---

## scss的全局变量
>配置scss样式的全局变量，这样就不用在每个组件的style里都引入变量文件，可以直接使用
1. 安装
    ```
    vue add style-resources-loader
    ```
2. 安装成功后，会在vue.config.js中生成，具体配置如下
    ```
    const path = require('path')

    module.exports = {
      pluginOptions: {
        'style-resources-loader': {
          preProcessor: 'scss',
          patterns: [path.resolve(__dirname, './src/assets/scss/variables.scss')]
        }
      }
    }
    ```
3. 如果安装出错，删除node_modules文件夹，重新执行步骤1

---

## 配置域名文件
>一级域名根据环境自动变换
在utils文件下添加domain.js
```
export const apiDomain = 'http://gw.api.zhiquanxia.' + process.env.VUE_APP_DOMAIN
```

VUE_APP_DOMAIN设为cn或com，详见[vue cli 3文档：环境变量和模式](https://cli.vuejs.org/zh/guide/mode-and-env.html#%E6%A8%A1%E5%BC%8F)

---

## 封装axios
>配置axios，统一接口请求，增加拦截器，分离出api接口文件，在src下新建http文件夹

1. 安装
    ```
    npm i axios
    ```
2. 给axios配置拦截器，http文件夹里添加service.js
    ```
    import axios from 'axios'
    import { apiDomain } from '../utils/domain'

    // 请求的默认配置
    const service = axios.create({
      timeout: 60 * 1000,
      baseURL: process.env.NODE_ENV === 'development' ? '' : apiDomain
    })

    // 添加请求拦截器
    service.interceptors.request.use(
      res => {
        // 在发送请求之前做些什么
        return res
      },
      error => {
        // 对请求错误做些什么
        return Promise.reject(error)
      }
    )

    // 添加响应拦截器
    service.interceptors.response.use(
      res => {
        // 对响应数据做点什么
        return res
      },
      error => {
        // 对响应错误做点什么
        return Promise.reject(error)
      }
    )

    export default service
    ```
3. 给axios配置get、post等请求方法，以及添加请求时的loading样式、错误提示、错误处理。http文件夹里添加index.js
    ```
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
    ```
4. http文件夹里添加api.js文件
    ```
    export default {
      test: '/test'
    }
    ......
    ```
5. 配置全局的axios和api，在main.js里引入
    ```
    // main.js文件

    ...
    import Http from './http'
    import apis from './http/api'

    Vue.prototype.Http = Http
    Vue.prototype.apis = apis
    ...
    ```
6. 这样就可以在各个组件中使用请求接口了
    ```
    this.Http.get(this.apis.test).then(res => {
      console.log(res)
    })    
    ```

---

## 添加Mock.js
>拦截接口请求，返回自定义数据。不必等后端的接口完成，就可以先自行进行开发，做到完全前后端分离

1. 安装（只有开发才需要用到）
    ```
    npm i mockjs --save-dev
    ```
2. 添加mock.js文件，放在http文件夹里
    ```
    import Mock from 'mockjs'

    Mock.setup({
      timeout: 2000 //设置接口请求多久再返回数据
    })

    Mock.mock('/test', 'get', () => {
      return Mock.mock({
        name: 'Mike',
        age: 20
      })
    })

    ......
    ```
3. 在main.js里引入，开发环境时启用
    ```
    if (process.env.NODE_ENV === 'development') {
      require('./http/mock')
    }
    ```

---

## 添加vConsole
>在手机上运行时提供调试

1. 安装
    ```
    npm i vconsole
    ```
2. 添加vconsole.js文件
    ```
    import Vconsole from 'vconsole'

    const vConsole = new Vconsole()

    export default vConsole
    ```
3. 在main.js里引入，开发环境时启用
    ```
    if (process.env.NODE_ENV === 'development') {
      require('./http/mock')
      require('./utils/vconsole')
    }
    ```

---
