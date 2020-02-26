b<template>
  <div class='login'>
    <div class='container'>
      <div class="avatar">
        <img src="./../assets/logo.png" alt="">
      </div>
      <el-form ref="form" :model="logodata" :rules="rules" class="inputbox">
        <!-- 用户登录 -->
        <el-form-item label-width="0px" prop='username'>
          <el-input prefix-icon='iconfont icon-user' v-model="logodata.username"></el-input>
        </el-form-item>
        <!-- 用户名密码 -->
        <el-form-item>
          <el-input prefix-icon='iconfont  icon-3702mima' v-model="logodata.password"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btn">
          <el-button type="primary" @click="loginbtn">登陆</el-button>
          <el-button type="info" @click="restbtn">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { login } from './../api/api'
import { setToken } from './../utils/stroges'
export default {
  data() {
    return {
      //登录表单的数据对象
      logodata: {
        username: "admin",
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    restbtn() {
      this.$refs.form.resetFields()
    },
    loginbtn() {
      this.$refs.form.validate(async (validata) => {
        if (!validata) return
        // eslint-disable-next-line no-console
        console.log(this.logodata.username);
        let res = await login(this.logodata.username, this.logodata.password)
        // eslint-disable-next-line no-console
        console.log(res);
        if (res.meta.status != 200) return this.$message.error('登陆失败')
        this.$message.success('登陆成功')

        //设置token
        setToken('token', res.data.token)

        //编程式跳转页面
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="stylus">
.login {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2b4b6b;
}

.container {
  width: 450px;
  height: 304px;
  background: white;
  position: relative;
  border-radius: 10px;
}

.avatar img {
  max-width: 100%;
  max-height: 100%;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.avatar {
  width: 66px;
  height: 66px;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px #888;
  border-radius: 50%;
  background: #eee;
  padding: 5px;
}

.inputbox {
  width: 100%;
  position: absolute;
  bottom: 0;
  padding: 20px;
}

.btn {
  display: flex;
  justify-content: flex-end;
}
</style>