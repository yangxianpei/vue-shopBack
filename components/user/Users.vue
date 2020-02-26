<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 搜索 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUser">
            <el-button slot="append" icon="el-icon-search" @click="getUser"></el-button>
          </el-input>
        </el-col>
        <el-col :span="7">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table :data="userlist" border>
        <el-table-column type="index" label="#">
        </el-table-column>
        <el-table-column prop="username" label="姓名">
        </el-table-column>
        <el-table-column prop="email" label="邮箱">
        </el-table-column>
        <el-table-column prop="mobile" label="电话">
        </el-table-column>
        <el-table-column prop="role_name" label="角色">
        </el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="switchState(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px;">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="modify(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deletebtn(scope.row.id)"></el-button>
            <el-tooltip effect="dark" content="权限分配" placement="top">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="distributeBtn(scope.row)"></el-button>
            </el-tooltip>

          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!-- 对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close='dialogclose'>
      <!-- 表单 -->
      <el-form :model="addUser" :rules="rules" ref="ruleForm" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUser.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUser.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUser.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUser.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="adduser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog title="修改用户 " :visible.sync="modifyVisible" width="50%">
      <el-form :model="editInfo" :rules="editInforules" ref="editInfoRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editInfo.username" disabled></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editInfo.email"></el-input>
        </el-form-item>

        <el-form-item label="mobile" prop="mobile">
          <el-input v-model="editInfo.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyVisible = false">取 消</el-button>
        <el-button type="primary" @click="modifyuser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog title="提示" :visible.sync="distributeDialog" width="50%" @close='cancelbtn'>
      <div>
        <p>当前用户：{{userinfo.username}}</p>
        <p>当前角色：{{userinfo.role_name}}</p>
        <p>分配新角色：
          <el-select v-model="selectRes" placeholder="请选择">
            <el-option v-for="item in rolelist" :key="item.id" :label="item.roleName" :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="distributeDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleinfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUser, saveUserState, adduser, modifyInfo, modifyUser, delUser, roles,saveRoles } from '@/api/api'
export default {
  data() {
    let emailrules = (rules, value, cb) => {
      //自定义校验规则
      let pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      if (pattern.test(value)) {
        return cb()
      }
      // eslint-disable-next-line no-undef
      return cb(new Error("输入合法邮箱"))
    }
    let phonerules = (rules, value, cb) => {
      let telStr = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/;
      if (telStr.test(value)) {
        return cb()
      }
      return cb(new Error("输入合法手机号"))
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userlist: [],
      total: 0,
      // 对话框显示隐藏
      dialogVisible: false,
      addUser: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: emailrules, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: phonerules, trigger: 'blur' }
        ]
      },
      modifyVisible: false,
      // 查询到的用户对象
      editInfo: {},
      editInforules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: emailrules, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: phonerules, trigger: 'blur' }
        ]
      },
      distributeDialog: false,
      //用户信息
      userinfo: {},
      //角色列表
      rolelist:[],

      selectRes:''
    }
  },
  mounted() {
    this.getUser()
  },
  methods: {
    async getUser() {
      let res = await getUser(this.queryInfo)
      if (res.meta.status != 200) return this.$message.error('获取失败')
      let { total } = res.data
      this.total = total
      this.userlist = res.data.users
    },
    handleSizeChange(newpagesize) {
      this.queryInfo.pagesize = newpagesize
      this.getUser()
    },
    handleCurrentChange(newpagenum) {
      this.queryInfo.pagenum = newpagenum;
      this.getUser()
    },
    async switchState(data) {

      let { id, mg_state } = data
      let res = await saveUserState(id, mg_state)
      if (res.meta.status != 200) {
        data.mg_state = !data.mg_state
        return this.$message.error('更新失败')
      }
      this.$message.success('更新成功')
    },
    dialogclose() {
      this.$refs.ruleForm.resetFields()
    },
    adduser() {
      this.$refs.ruleForm.validate(async validate => {
        if (!validate) return
        let res = await adduser(this.addUser)
        if (res.meta.status != 201) return this.$message.error('创建失败')
        this.$message.success('创建成功')
        this.getUser()
        this.dialogVisible = false
      })
    },
    async modify(id) {
      this.modifyVisible = true
      let res = await modifyInfo(id)
      if (res.meta.status != 200) return this.$message.error('获取失败')
      this.editInfo = res.data
    },
    modifyuser() {

      this.$refs.editInfoRef.validate(async validate => {
        if (!validate) return
        let info = { email: this.editInfo.email, mobile: this.editInfo.mobile }
        let res = await modifyUser(this.editInfo.id, info)
        if (res.meta.status !== 200) return this.$message.error('修改失败')
        this.$message.success('更新用户成功')
        this.modifyVisible = false
        this.getUser()

      })

    },
    async deletebtn(id) {
      let res = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (res != 'confirm') return this.$message.info('已取消')
      let res2 = await delUser(id)
      if (res2.meta.status != 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.getUser()
    },
    async distributeBtn(userinfo) {
      this.userinfo = userinfo
      let res = await roles()
      if (res.meta.status != 200) return this.$message.error('获取失败')
      console.log(res);
      this.rolelist=res.data
      this.distributeDialog = true
    },
    async saveRoleinfo(){
      if(!this.selectRes){
        this.$message.error('请选择要分配的角色')
      }
     let res= await saveRoles(this.userinfo.id,this.selectRes)
       if(res.meta.status !=200) return this.$message.error('获取失败')
       this.getUser()
       this.distributeDialog=false
    },
    cancelbtn(){
      this.selectRes=''
    }
  }
}
</script>
<style lang="stylus" scoped>

</style>
