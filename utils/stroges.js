const setToken=(name,token)=>{
  window.sessionStorage.setItem(name,token)
}

const getToken =(name)=>{
  window.sessionStorage.getItem(name)
}

export {
  setToken,
  getToken
}