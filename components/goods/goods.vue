<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="input5" clearable>
            <el-button slot="append" icon="el-icon-search" @click="seachbtn"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addgoods">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="gooslist" border style="width: 100%">
        <el-table-column type="index" label="#">
        </el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="500">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格" width="85px">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="70px">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="140px">
          <template slot-scope="scope">
            {{scope.row.add_time | dateformate}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="delebtn(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryinfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryinfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getgoods,delgoods } from '@/api/api'
export default {
  data() {
    return {
      input5: '',
      queryinfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      gooslist: [],
      total:0
    }
  },
  mounted() {
    this.getgoodslist()
  },
  methods: {
    async getgoodslist() {
      let res = await getgoods(this.queryinfo)
      if (res.meta.status != 200) return this.$message.error('获取失败')
      this.gooslist = res.data.goods
      let {pagenum,total}=res.data
      this.queryinfo.pagenum=parseInt(pagenum)
      this.total=total
    },
    handleSizeChange(newsize){
      this.queryinfo.pagesize=parseInt(newsize)
      this.getgoodslist()
    },
    handleCurrentChange(newPage){

      this.queryinfo.pagenum=parseInt(newPage)
       this.getgoodslist()
    },
    async seachbtn(){
      this.queryinfo.query=this.input5
      let res = await getgoods(this.queryinfo)
        if(res.meta.status !=200) return this.$message.error('获取失败')
      this.gooslist=res.data.goods 
      this.queryinfo.pagenum=parseInt(res.data.pagenum)
      this.total=res.data.total
    },
    async delebtn(row){
      let pro=await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
      if(pro!='confirm') return
      let res=await delgoods(row.goods_id)
       if(res.meta.status !=200) return this.$message.error('删除失败')
       this.$message.success('删除成功')
       this.getgoodslist()
    },
    addgoods(){
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style lang="stylus" scoped>
.el-table__row {
  font-size: 12px;
}
</style>