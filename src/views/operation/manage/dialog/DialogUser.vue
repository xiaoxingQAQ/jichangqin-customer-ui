<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    center
    width="600px"
    append-to-body
    :before-close="handleClose"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-row>
        <el-col :span="12">
          <el-form-item
            v-if="form.userId == undefined"
            label="用户名称"
            prop="userName"
          >
            <el-input
              v-model="form.userName"
              placeholder="请输入用户名称"
              maxlength="30"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            v-if="form.userId == undefined"
            label="用户密码"
            prop="password"
          >
            <el-input
              v-model="form.password"
              placeholder="请输入用户密码"
              type="password"
              maxlength="20"
              show-password
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="用户昵称" prop="nickName">
            <el-input
              v-model="form.nickName"
              placeholder="请输入用户昵称"
              maxlength="30"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号码" prop="phonenumber">
            <el-input
              v-model="form.phonenumber"
              placeholder="请输入手机号码"
              maxlength="11"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="负责人" prop="leader">
            <el-input
              v-model="form.leader"
              placeholder="请输入负责人"
              maxlength="50"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="角色" prop="roleId">
            <el-select v-model="form.roleId" placeholder="请选择">
              <el-option
                v-for="item in roleOptions"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleId"
                :disabled="item.status == 1"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="form.userId == undefined ? 24 : 12">
          <el-form-item style="width: 100%" label="用户类型" prop="type">
            <el-select
              style="width: 100%"
              v-model="form.type"
              placeholder="请选择用户类型"
            >
              <el-option
                v-for="item in userTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="部门机构"
            prop="deptId"
            v-if="form.userId != undefined"
          >
            <treeselect
              v-model="form.deptId"
              :options="deptOptions"
              :show-count="true"
              placeholder="请选择机构"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 暂时隐藏 -->
      <!-- <el-row>
        <el-col :span="12">
          <el-form-item label="密保问题" prop="encrypted">
            <el-col :span="12">
              <el-select
                v-model="form.encrypted"
                placeholder="请选择"
                style="width: 200%"
              >
                <el-option
                  v-for="item in options_2"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="密保答案" prop="answer">
            <el-input v-model="form.answer" placeholder=""></el-input>
          </el-form-item>
        </el-col>
      </el-row> -->
    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
      v-if="info.user.userName !== form.userName"
    >
      <el-button type="primary" @click="handleOk" :loading="loading"
        >保 存</el-button
      >
      <el-button type="danger" @click="handleClose">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { mapGetters } from 'vuex';

const userTypes = [
  { value: 20, label: '普通用户' },
  { value: 30, label: '油库用户' }
]
export default {
  components: {
    Treeselect,
  },
  props: {
    visible: Boolean,
    title: String,
    deptOptions: Array,
    roleOptions: Array,
    form: {
      type: Object,
      default() {
        return {
          nickName: null, // 昵称
          phonenumber: null, // 联系方式
          userName: null, // 用户名
          password: null, // 密码
          leader: null, // 负责人
          roleId: null,
          deptId: null, // 用户组
          type: null, // 用户类型

          encrypted: null, // 密保问题
          answer: null, // 答案
        }
      }
    }
  },
  data() {
    return {
      userTypes: userTypes,
      loading: false,
      options_1: [],
      options_2: null,

      rules: {
        userName: [
          { required: true, pattern: /^[a-zA-Z0-9_-]{6,20}$/, message: "用户名至少六位字符，不能出现中文", trigger: "blur" },
          { min: 6, max: 20, message: '用户名称长度必须介于 2 和 20 之间', trigger: 'blur' }
        ],
        password: [
          { required: true, pattern: /^[a-z0-9A-Z]{8,20}$/, message: "密码至少八位", trigger: "blur" },
          { min: 8, max: 20, message: '用户密码长度必须介于 8 和 20 之间', trigger: 'blur' }
        ],
        nickName: [
          { required: false, message: "用户昵称不能为空", trigger: "blur" }
        ],
        deptId: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        leader: [
          { required: false, message: "请输入负责人", trigger: "blur" },
        ],
        roleId: [
          { required: true, message: "请选择角色", trigger: "blur" },
        ],
        type: [
          { required: true, message: "用户类型不能为空", trigger: "blur" },
        ],
        phonenumber: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ],
        /*  encrypted: [
           { required: false, message: "请选择密保问题", trigger: "blur" },
         ],
         answer: [
           { required: false, message: "请输入密保答案", trigger: "blur" },
         ], */

      },
      options_2: [
        {
          value: '问题一',
          label: '问题一'
        },
        {
          value: '问题二',
          label: '问题二'
        }
      ],
    }
  },
  computed: {
    ...mapGetters(['info'])
  },
  watch: {
    visible(val) {
      if (!val)
        this.handleClose()
    },
    roleOptions(val) {
      console.log(val);
    }
  },
  methods: {
    handleClose() {
      this.$emit('close')
      this.$refs.form.resetFields()
      this.loading = false
    },
    handleOk() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('ok', this.form)
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
</style>