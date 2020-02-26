<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">主要按钮</el-button>
        </el-col>
        <el-col>
          <el-table :data="roleslist" style="width: 100%" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-row v-for="(item,i) in scope.row.children" :key="item.id" :class="['bottomline', i==0?'topline':'','vcenter']">
                  <!-- 一级列表 -->
                  <el-col :span="5">
                    <el-tag>{{item.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 二三级列表 -->
                  <el-col :span="19">
                    <el-row v-for="(item2,i2) in item.children" :key="item2.key" :class="[i2!=0?'topline':'','vcenter']" align='middle'>
                      <el-col :span="6">
                        <el-tag type="success">{{item2.authName}}</el-tag>
                        <i class="el-icon-caret-right"></i>
                      </el-col>
                      <!-- 三级列表 -->
                      <el-col :span="18">
                        <el-tag type="danger" v-for="item3 in item2.children" :key="item3.id" closable @close='removeTag(scope.row,item3.id)'>{{item3.authName}}</el-tag>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
            <!-- 行为列 -->
            <el-table-column type="index" label="#">
            </el-table-column>
            <el-table-column prop="roleName" label="角色名称">
            </el-table-column>
            <el-table-column prop="roleDesc" label="角色描述">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
                <el-button type="warning" size="mini" icon="el-icon-setting" @click="distribution(scope.row)">分配权限</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-card>

    <!-- 分配权限对话框 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="50%" @close='resentdialog'>
      <el-tree :data="rightslist" :props="defaultProps" show-checkbox default-expand-all node-key='id' :default-checked-keys='defaultArr' ref="tree"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogbtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getroles, deleroles, getrights, modifyRight } from '@/api/api'
export default {
  data() {
    return {
      roleslist: [],
      dialogVisible: false,
      rightslist: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      //tree默认选中的数组,存放的id
      defaultArr: [],
      roleId: ''
    }
  },
  mounted() {
    this.getrolesFn()
  },
  methods: {
    async getrolesFn() {
      let res = await getroles()
      if (res.meta.status != 200) return this.$message.error('获取失败')
      this.roleslist = res.data
    },
    async  removeTag(roles, rightid) {

      let comfirmres = await this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (comfirmres != 'confirm') {
        return this.$message.info('已取消')
      }

      let res = await deleroles(roles.id, rightid)
      if (res.meta.status != 200) return this.$message.error('删除失败')

      this.$message.success('取消权限成功')
      roles.children = res.data
    },
    async distribution(roles) {
      let res = await getrights('tree')
      if (res.meta.status != 200) return this.$message.error('获取失败')
      this.rightslist = res.data
      this.cycleFindId(roles, this.defaultArr)
      this.dialogVisible = true
    },

    cycleFindId(roles, arr) {
      this.roleId = roles.id
      if (!roles.children) {
        return arr.push(roles.id)
      }
      roles.children.forEach(item => {
        this.cycleFindId(item, arr)
      })
    },
    resentdialog() {
      this.defaultArr = []
    },
    async dialogbtn() {
      let resdata = [
        ...this.$refs.tree.getHalfCheckedKeys(),
        ...this.$refs.tree.getCheckedKeys()
      ]

      let str = resdata.join(',')
      let res = await modifyRight(this.roleId, str)
      if (res.meta.status != 200) {     
        return this.$message.error('获取失败')    
      }
      this.$message.success('更新权限成功')
      this.dialogVisible = false

    }
 
  }
}
</script>

<style lang="stylus">
.el-tag {
  margin: 10px 10px;
}

.topline {
  border-top: 1px solid #eee;
}

.bottomline {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
