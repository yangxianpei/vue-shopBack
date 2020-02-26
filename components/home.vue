<template>
  <el-container>
    <el-header>
      <div class="logo">
        <img src="./../assets/1577785531(1).jpg" alt="">
        <span>电商管理后台系统</span>
      </div>
      <el-button type="info" size="mini" @click="quitbtn">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isshink?'64px':'200px'" >
        <!-- 菜单 -->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#ffd04b" unique-opened  :collapse='isshink' :collapse-transition="false" router :default-active="$route.path">
          <div class="shinkbtn" @click="shinkbtn">|||</div>
          <!-- 一级菜单 -->
          <el-submenu :index="`${item.id}`" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单模板 -->
            <template slot="title">
              <i :class="iconsData[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>

            <!--二级菜单 -->
            <el-menu-item :index="`/${subitem.path}`" v-for="subitem in item.children" :key="subitem.id" @click="threebtn">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subitem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
      <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getmenus } from '@/api/api'
export default {
  data() {
    return {
      menulist: [],
      iconsData: {
        '125': 'iconfont icon-users',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      value1:5,
      isshink:false
    }
  },
  created() {
    this.getmenus()
  },
  mounted(){
  },
  methods: {
    quitbtn() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getmenus() {
      let res = await getmenus()
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
    },
    shinkbtn(){
      this.isshink=!this.isshink
    },
    threebtn(){
      console.log(this.$route.path);
    }
  },
 
}
</script>

<style lang="stylus">
.el-container {
  height: 100%;
}

.el-header {
  background-color: #333744;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .logo {
    display: flex;
    align-items: center;

    span {
      margin-left: 10px;
      color: white;
      font-size: 22px;
    }

    img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
    }
  }
}

.el-aside {
  background-color: #333744;

  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eee;
}

.iconfont {
  margin-right: 10px;
}
.shinkbtn{
  background-color #4a5064;
  line-height 25px;
  text-align center;
  color white;
  font-size 12px;
  letter-spacing .1em;
  cursor pointer;
}
</style>