import axios from 'axios'
import Nprogress from 'nprogress'
console.log(Nprogress);
class  AjaxRequest{
   constructor(){
      this.baseURL='http://127.0.0.1:8887/api/private/v1',
      this.timeout=4000
   }
   setInterceptor(instance){
     //请求拦截
    instance.interceptors.request.use((config)=>{
      Nprogress.start()
       config.headers.Authorization=window.sessionStorage.getItem('token')
        return config
    })
    //响应拦截
    instance.interceptors.response.use((res)=>{
      Nprogress.done()
      return res.data
    })
   }
   request(optipns){
    let instance = axios.create()
    let config={...optipns,baseURL:this.baseURL,timeout:this.timeout}
    this.setInterceptor(instance)

    return instance(config)
   }
}

export default new AjaxRequest