<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert title="添加商品信息" type="info" show-icon center>
      </el-alert>
      <el-steps :space="200" :active="activeindex-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" label-position='top'>
        <el-tabs :tab-position="'left'" v-model="activeindex" :before-leave='levaefn' @tab-click='tabclicked'>
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="ruleForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="ruleForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="ruleForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="ruleForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" >
              <el-cascader expand-trigger="hover" :options="catelist" v-model="ruleForm.goods_cat" @change="handleChange" :props='props'>
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 商品参数 -->
            <el-form-item :label="item.attr_name" v-for="item in manyTabdata" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key='i' border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in  onlyTabdata" :key='item.attr_id'>
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload class="upload-demo" :action="uploadurl" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture" :headers='headersobj' :on-success='handleSuccess'>
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="ruleForm.goods_introduce"></quill-editor>
            <el-button type="primary" @click="addgoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt="" width="100%">
    </el-dialog>
  </div>
</template>
<script>
import { categories, addparsms,addgoods } from '@/api/api'
import _ from 'lodash'
export default {
  data() {
    return {
      activeindex: "0",
      ruleForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat:[],
        pics: [],
        goods_introduce: '',
        attrs:[]
      },
      rules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        good_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      catelist: [],
      selectedOptions2: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      //动态属性
      manyTabdata: [],
      //静态属性
      onlyTabdata: [],
      uploadurl: 'http://127.0.0.1:8888/api/private/v1/upload',
      headersobj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewPath: '',
      previewVisible: false
    }
  },
  mounted() {
    this.getcatelist()
  },
  computed: {
    id() {
      if (this.ruleForm.goods_cat.length == 3) {
        return this.ruleForm.goods_cat[2]
      }
      return null
    }
  },
  methods: {
    async getcatelist() {
      let res = await categories(null)
      if (res.meta.status != 200) return this.$message.error('获取失败')
      this.catelist = res.data
    },
    handleChange() {
      if (this.ruleForm.goods_cat.length != 3) {
        this.ruleForm.goods_cat = []
        return
      }
    },
    levaefn(activeName, oldactiveName) {
      if (oldactiveName == 0 && this.ruleForm.goods_cat.length != 3) {
        this.$message.error('请选择商品分类')
        return false
      }
    },
    async  tabclicked() {
      //  获取商品参数信息
      if (this.activeindex == 1) {
        let res = await addparsms(this.id, { sel: 'many' })
        if (res.meta.status != 200) return this.$message.error('获取失败')
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length == 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTabdata = res.data

      } else if (this.activeindex == 2) {
        let res = await addparsms(this.id, { sel: 'only' })
        if (res.meta.status != 200) return this.$message.error('获取失败')
        this.onlyTabdata = res.data
      }
    },
    handlePreview(file) {
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    handleRemove(file) {
      let removepath = file.response.data.tmp_path
      this.ruleForm.pics = this.ruleForm.pics.filter(item => item.pic != removepath)
    },
    handleSuccess(res) {

      let obj = { pic: res.data.tmp_path }
      this.ruleForm.pics.push(obj)
    },
     addgoods(){
      this.$refs.ruleForm.validate(async valid=>{
        if(!valid) {
          return this.$message.error('请填写必填项！')
        }
         let formobj =_.cloneDeep(this.ruleForm)

          formobj.goods_cat=formobj.goods_cat.join(',')
          
          this.manyTabdata.forEach(item=>{
            let newinfo={attr_id:item.attr_id,attr_value:item.attr_vals.join(',')}
            this.ruleForm.attrs.push(newinfo)
          })
          //静态属性
           this.onlyTabdata.forEach(item=>{
            let newinfo={attr_id:item.attr_id,attr_value:item.attr_vals}
            this.ruleForm.attrs.push(newinfo)
          })

          formobj.attrs=this.ruleForm.attrs
          let res=await addgoods(formobj)
            if(res.meta.status !=201) return this.$message.error(res.meta.msg)
            this.$message.success('创建成功')
            this.$router.push('/goods')
      })
    }
  }
}
// 160
</script>
<style lang="stylus" scoped>
.el-steps {
  margin: 20px 0;
}

.el-checkbox {
  margin: 0 5px 0 0 !important;
}

</style>

