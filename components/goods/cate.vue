<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button type='primary' @click="addcate">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <tree-tabel class="treetable" :data='catelist' :columns='columns' :selection-type='false' :expand-type='false' show-index index-text="#" border :show-row-hover='false'>
        <!-- 是否有效列模板 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="!scope.row.cat_deleted" style="color:lightgreen;"></i>
          <i class="el-icon-error" style="color:red;" v-else></i>
        </template>
        <!-- 排序模板列-->
        <template slot-scope="scope" slot='order'>
          <el-tag size='mini' v-if="scope.row.cat_level ==0">一级</el-tag>
          <el-tag type="success" size='mini' v-else-if="scope.row.cat_level ==1">二级</el-tag>
          <el-tag type="danger" size='mini' v-else>三级</el-tag>
        </template>
        <!-- 操作模板列 -->
        <template slot="opration" slot-scope="scope">
          <el-button type="primary" size="mini" @click="modifybtn(scope.row)">修改</el-button>
          <el-button type="danger" size="mini" @click="deletebtn(scope.row)">删除</el-button>
        </template>
      </tree-tabel>
      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryinfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryinfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="50%" @close='addCateClosed'>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="ruleForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader v-model="selectdata" :options="parantCatelist" :props="selectProps" @change="handleChange" clearable></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addsure">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改对话框 -->
    <el-dialog title="修改" :visible.sync="modifyVisible" width="50%">
      <el-form :model="modifyinfo" :rules="modifyinforules" ref="modifyruleForm" label-width="100px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="modifyinfo.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyVisible = false">取 消</el-button>
        <el-button type="primary" @click="modifysure()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { categories, addcate, modifycate } from '@/api/api'
export default {
  data() {
    return {
      queryinfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      catelist: [],
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          //表示，将当前列定义为模板
          type: 'template',
          //表示当前一列使用模板名称
          template: 'isok'
        },
        {
          label: '排序',
          //表示，将当前列定义为模板
          type: 'template',
          //表示当前一列使用模板名称
          template: 'order'
        },
        {
          label: '操作',
          //表示，将当前列定义为模板
          type: 'template',
          //表示当前一列使用模板名称
          template: 'opration'
        }
      ],
      dialogVisible: false,
      ruleForm: {
        cat_name: '',
        cat_pid: 0,
        //默认添加一级分类
        cat_level: 0
      },
      rules: {
        cat_name: [
          { required: true, message: '请输入分类名', trigger: 'blur' }
        ]
      },
      parantCatelist: [],
      selectdata: [],
      selectProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      modifyVisible: false,

      modifyinforules: {
        name: [
          { required: true, message: '请输入分类名', trigger: 'blur' }
        ]
      },
      modifyinfo: {
        name: ""
      }
    }
  },
  mounted() {
    this.getcatelist()
  },
  methods: {
    async getcatelist() {
      let res = await categories(this.queryinfo)
      if (res.meta.status != 200) return this.$message.error('获取失败')
      let { pagenum, pagesize, total } = res.data
      this.queryinfo.pagenum = pagenum
      this.queryinfo.pagesize = pagesize
      this.catelist = res.data.result
      this.total = total
    },
    // 监听新的分页
    handleSizeChange(newpage) {
      this.queryinfo.pagesize = newpage
      this.getcatelist()
    },
    handleCurrentChange(newpagenum) {
      this.queryinfo.pagenum = newpagenum
      this.getcatelist()
    },
    async addcate() {
      let res = await categories({ type: 2 })
      if (res.meta.status != 200) return this.$message.error('获取失败')
      this.parantCatelist = res.data
      this.dialogVisible = true
    },
    addsure() {
      this.$refs.ruleForm.validate(async validate => {
        if (!validate) return
        let res = await addcate(this.ruleForm)
        if (res.meta.status != 201) return this.$message.error('添加失败')
        this.$message.success('添加成功')
        this.getcatelist()
        this.dialogVisible = false

      })
    },
    handleChange() {
      if (this.selectdata.length > 0) {
        this.ruleForm.cat_pid = this.selectdata[this.selectdata.length - 1]
        this.ruleForm.cat_level = this.selectdata.length
      } else {
        this.ruleForm.cat_pid = 0
        this.ruleForm.cat_level = 0
      }
    },
    addCateClosed() {
      this.$refs.ruleForm.resetFields()
      this.selectdata = []
    },
    modifybtn(scope) {
      this.scope = scope
      this.modifyinfo.name = scope.cat_name
      this.modifyVisible = true
    },
    async modifysure() {
      let res = await modifycate(this.scope.cat_id, { cat_name: this.modifyinfo.name },'put')
      if (res.meta.status != 200) return this.$message.error('修改失败')
      this.$message.success('修改成功')
      this.getcatelist()
      this.modifyVisible=false

    },
   async deletebtn(scope) {
     let pro= await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err=>err)
      if(pro !=='confirm'){
        return this.$message.info("取消了")
      }
      
     let res= await modifycate(scope.cat_id,null,'delete')
       if(res.meta.status !=200) return this.$message.error('删除失败')
       this.$message.success('删除成功')
       this.getcatelist()
    }

  }
}
</script>

<style lang="stylus" scoped>
.treetable {
  margin-top: 10px;
}
</style>