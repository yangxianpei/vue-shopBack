<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon>
      </el-alert>
      <div class="select">
        <span>选择商品分类：</span>
        <el-cascader expand-trigger="hover" :options="catelist" v-model="selectedOptions2" @change="handleChange" :props='props' clearable>
        </el-cascader>
      </div>
      <!-- tabs -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size='mini' :disabled="isdisabel" @click="addprops">添加参数</el-button>
          <el-table :data="manyData" style="width: 100%" border>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- tag -->
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key='i' closable @close='handleclose(i,scope.row)'>{{item}}</el-tag>
                <el-input class="input-new-tag"  style='width:120px;' v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#">
            </el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="editbtn(scope.row)">修改</el-button>
                <el-button type="danger" size="mini" @click='deletebtn(scope.row)'>删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size='mini' :disabled="isdisabel" @click="addprops">添加属性</el-button>
          <el-table :data="onlyData" style="width: 100%" border>
              <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- tag -->
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key='i' closable @close='handleclose(i,scope.row)'>{{item}}</el-tag>
                <el-input class="input-new-tag"  style='width:120px;' v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#">
            </el-table-column>
            <el-table-column prop="attr_name" label="属性名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="editbtn(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" @click='deletebtn(scope.row)'>删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数 -->
    <el-dialog :title='`添加${isshowfont}`' :visible.sync="dialogVisible" width="50%" @close='cancelbtn'>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="isshowfont" prop="attr_name">
          <el-input v-model="ruleForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改属性 -->
    <el-dialog :title='`修改${isshowfont}`' :visible.sync="modifyVisible" width="50%" @close='cancelbtn(2)'>
      <el-form :model="modifyruleForm" :rules="modifyrules" ref="modifyruleForm" label-width="100px">
        <el-form-item :label="isshowfont" prop="name">
          <el-input v-model="modifyruleForm.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyVisible = false">取 消</el-button>
        <el-button type="primary" @click="addsure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { categories, modifycate, addparsms, addparsmsPost, modifycatePut } from '@/api/api'
export default {
  data() {
    return {
      catelist: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedOptions2: [],
      activeName: 'many',
      curentInfo: {},
      manyData: [],
      onlyData: [],
      dialogVisible: false,
      ruleForm: {
        attr_name: ""
      },
      rules: {
        attr_name: [
          { required: true, message: '请添加参数名称', trigger: 'blur' },
        ]
      },
      modifyrules: {
        name: [
          { required: true, message: '请添加参数名称', trigger: 'blur' },
        ]
      },
      modifyVisible: false,
      modifyruleForm: {
        name: ''
      },
      inputVisible:false,
      inputValue:''
    }
  },
  mounted() {
    this.getcatelist()
  },
  computed: {
    isdisabel() {
      if (this.selectedOptions2.length == 3) {
        return false
      }
      return true
    },
    cateId() {
      if (this.selectedOptions2.length == 3) {
        return this.selectedOptions2[2]
      }
      return null
    },
    isshowfont() {
      if (this.activeName == 'many') {
        return '动态参数'
      }
      return '静态属性'
    },

  },
  methods: {
    async getcatelist() {
      let res = await categories({ type: 3 })
      this.catelist = res.data
    },
    handleChange(e) {
      this.getNeedData()
    },
    async getNeedData() {
      if (this.selectedOptions2.length != 3) {
        this.selectedOptions2 = []
        this.manyData=[],
        this.onlyData=[]
        return
      }
      let res = await addparsms(this.cateId, { sel: this.activeName })

      if (res.meta.status != 200) return this.$message.error('获取失败')
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 提供自己单独的input model值
        item.inputValue=''
        //提供自己的v-if值
        item.inputVisible=false
      })
      if (this.activeName == 'many') {
        this.manyData = res.data
      } else {
        this.onlyData = res.data
      }


    },
    handleClick() {
      this.getNeedData()
    },
    addprops() {

      this.dialogVisible = true
    },
    cancelbtn(d) {
      if (d == 2) {
        return this.$refs.modifyruleForm.resetFields()
      }
      return this.$refs.ruleForm.resetFields()
    },
    addParams() {
      this.$refs.ruleForm.validate(async validate => {
        if (!validate) return
        let res = await addparsmsPost(this.cateId, {
          attr_name: this.ruleForm.attr_name,
          attr_sel: this.activeName
        }, 'post')
        if (res.meta.status != 201) return this.$message.error('添加失败')

        this.$message.success('添加成功')
        this.getNeedData()
        this.dialogVisible = false
      })
    },
    editbtn(scope) {
      this.attr_id = scope.attr_id
      this.modifyruleForm.name = scope.attr_name
      this.modifyVisible = true
    },
    addsure() {
      this.$refs.modifyruleForm.validate(async validate => {
        if (!validate) return
        let res = await modifycatePut(this.cateId, this.attr_id, {
          attr_name: this.modifyruleForm.name,
          attr_sel: this.activeName
        }, 'put')
        if (res.meta.status != 200) return this.$message.error('更新失败')
        this.$message.success('更新成功')
        this.getNeedData()
        this.modifyVisible = false
      })
    },
    async deletebtn(scope) {
      let pro = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (pro != 'confirm') return
      let res = await modifycatePut(this.cateId, scope.attr_id, null, 'delete')
      if (res.meta.status != 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.getNeedData()
    },
    async handleInputConfirm(row){
      if(row.inputValue.trim().length==0){
        row.inputValue=''
        row.inputVisible=false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue=''
      row.inputVisible=false
      this.saveAttrvals(row)
    },
    async saveAttrvals(row){
       let res=await modifycatePut(this.cateId,row.attr_id,
      {
        attr_name:row.attr_name,
        attr_sel:row.attr_sel,
        attr_vals:row.attr_vals.join(' ')
      },'put')
        if(res.meta.status !=200) return this.$message.error('更新失败')
        this.$message.success('更新成功')
    },
    showInput(row){
      row.inputVisible=true
      // nextTick 放在下个队列开始调用，因为inputVisible=true 页面中还是那个按钮获取不到input
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
    },
    handleclose(i,row){
      row.attr_vals.splice(i,1)
      this.saveAttrvals(row)
    }
  }
}
</script>

<style lang="stylus" scoped>
.select {
  margin: 15px 0;
}
.input-new-tag{
  width 120px;
}
</style>