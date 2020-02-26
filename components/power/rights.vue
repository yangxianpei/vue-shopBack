<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-table :data="list" style="width: 100%" border stripe>
        <el-table-column type="index" label="#">
        </el-table-column>
        <el-table-column prop="authName" label="权限名称" >
        </el-table-column>
        <el-table-column prop="path" label="路径" >
        </el-table-column>
        <el-table-column prop="level" label="权限等级" >
          <template slot-scope="scope">
            <el-tag v-if='scope.row.level==0'>一级</el-tag>
            <el-tag v-else-if="scope.row.level==1" type="success">二级</el-tag>
            <el-tag v-else type="info">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getlist } from '@/api/api'
export default {
  data() {
    return {
      list: []
    }
  },
  mounted() {
    this.getlistFn()
  },
  methods: {
    async getlistFn() {
      let res = await getlist()
      if (res.meta.status != 200) return this.$message.error('获取失败')
      this.list = res.data
      console.log(res);
    }
  }
}
</script>

<style lang="stylus"></style>