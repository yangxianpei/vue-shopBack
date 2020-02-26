<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderlist" border>
        <el-table-column type="index" label="#">
        </el-table-column>
        <el-table-column prop="order_number" label="订单编号">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格">
        </el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status==1" type="success">已付款</el-tag>
            <el-tag v-else type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货">
        </el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="scope">
            {{scope.row.update_time|dateformate}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button type="primary" icon="el-icon-edit" size='mini' @click="selectAdress"></el-button>
            <el-button type="success" icon="el-icon-location" size='mini' @click="wuli"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!-- 修改按钮对话框 -->
    <el-dialog title="修改地址" :visible.sync="dialogVisible" width="50%" @close='handleCancel'>
      <!-- 内容 -->
      <el-form :model="adressForm" :rules="adressrules" ref="adressFormref" label-width="100px" class="demo-ruleForm">
        <el-form-item label="省市区/县" prop="adress1">
          <el-cascader v-model="adressForm.adress1" :options="citydata" :props="{ expandTrigger: 'hover' }" @change="handleChange"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="adress2">
          <el-input v-model="adressForm.adress2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流 -->
    <el-dialog title="物流" :visible.sync="wuliuVisible" width="50%">
      <el-timeline >
        <el-timeline-item v-for="(activity, index) in wuliu" :key="index" :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import citydata from './citydata'
import wuliu from './wuliu'
import { getOrder } from '@/api/api';
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      orderlist: [],
      total: 0,
      dialogVisible: false,
      adressForm: {
        adress1: [],
        adress2: ''
      },
      adressrules: {
        adress1: [
          { required: true, message: '请选择区域', trigger: 'blur' }
        ],
        adress2: [
          { required: true, message: '请选择地址', trigger: 'blur' }
        ]
      },
      citydata,
      wuliuVisible: false,
      wuliu
    }
  },
  mounted() {
    this.getOrders()
  },
  methods: {
    async getOrders() {
      let res = await getOrder(this.queryInfo)
      if (res.meta.status != 200) return this.$message.error('获取失败')
      this.orderlist = res.data.goods
      this.queryInfo.pagenum = res.data.pagenum - 0
      this.total = res.data.total
      console.log(res);
    },
    handleSizeChange(newpage) {
      this.queryInfo.pagesize = newpage
      this.getOrders()
    },
    handleCurrentChange(newpagesize) {
      this.queryInfo.pagenum = newpagesize
      this.getOrders()
    },
    selectAdress() {
      this.dialogVisible = true
    },
    handleChange(e) {
      console.log(e);
    },
    handleCancel() {
      this.$refs.adressFormref.resetFields()
    },
    async wuli() {
      this.wuliuVisible = true
      let id = '1106975712662'
      let res = await getlogistics()
      console.log(res);
    }
  }
}
</script>

<style lang="stylus" scoped></style>

