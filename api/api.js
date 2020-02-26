import axios from '@/utils/AJaxRequest'

export const login=(username,password)=>{
  return axios.request({
    url:'/login',
    method:'post',
    data:{
      username,
      password
    }
  })
}

export const getmenus = ()=>{
  return axios.request({
    url:'/menus',
  })
}

export const getUser = (data)=>{
  let {query,pagenum,pagesize}=data
  return axios.request({
    url:`/users?query=${query}&pagenum=${pagenum}&pagesize=${pagesize}`
  })
}

export const saveUserState=(id,state)=>{
  return axios.request({
    url:`users/${id}/state/${state}`,
    method:'put'
  })
}

export const adduser=(data)=>{
  return axios.request({
    url:`/users`,
    method:'post',
    data
  })
}

export const modifyInfo=(id)=>{
  return axios.request({
    url:`/users/${id}`,
  })
}

export const modifyUser=(id,data)=>{
  return axios.request({
    url:`/users/${id}`,
    method:'put',
    data
  })
}

export const delUser=(id)=>{
  return axios.request({
    url:`/users/${id}`,
    method:'delete',
  })
}

export const getlist=()=>{
  return axios.request({
    url:`/rights/list`,
  })
}

export const getroles=()=>{
  return axios.request({
    url:`/roles`,
  })
}
export const deleroles=(rolesId,rightId)=>{
  return axios.request({
    url:`/roles/${rolesId}/rights/${rightId}`,
    method:'delete'
  })
}

export const getrights=(type)=>{
  return axios.request({
    url:`/rights/${type}`,
  })
}


export const modifyRight=(rolesId,data)=>{
  return axios.request({
    url:`/roles/${rolesId}/rights`,
    method:'post',
    data:{
      rids:data
    }
  })
}

export const roles=()=>{
  return axios.request({
    url:`/roles`,
  })
}


export const saveRoles=(id,data)=>{
  return axios.request({
    url:`/users/${id}/role`,
    data:{
      rid:data
    },
    method:'put'
  })
}

export const categories=(data)=>{
  return axios.request({
    url:`/categories`,
    params:data
  })
}

export const addcate=(data)=>{
  return axios.request({
    url:`/categories`,
    data,
    method:'post'
  })
}
export const modifycate=(id,data,type)=>{
  return axios.request({
    url:`/categories/${id}`,
    data,
    method:type
  })
}

export const addparsms=(id,data)=>{
  return axios.request({
    url:`/categories/${id}/attributes`,
    params:data,
  })
}

export const addparsmsPost=(id,data,type)=>{
  return axios.request({
    url:`/categories/${id}/attributes`,
    data,
    method:type
  })
}
export const modifycatePut=(id,attrId,data,type)=>{
  return axios.request({
    url:`/categories/${id}/attributes/${attrId}`,
    data,
    method:type
  })
}

export const getgoods=(data)=>{
  return axios.request({
    url:`/goods`,
    params:data
  })
}

export const delgoods=(id)=>{
  return axios.request({
    url:`/goods/${id}`,
    method:'delete'
  })
}

export const addgoods=(data)=>{
  return axios.request({
    url:`/goods`,
    data,
    method:'post'
  })
}

export const getOrder=(data)=>{
  return axios.request({
    url:`/orders`,
    params:data,
  })
} 

export const getechartsdata=()=>{
  return axios.request({
    url:`/reports/type/1`,
  })
} 





