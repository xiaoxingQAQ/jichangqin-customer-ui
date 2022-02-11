<template>
  <el-dialog
    title="详情查看"
    :visible.sync="visible_a"
    width="1322px"
    :before-close="handleCancel_a"
    class="impotDialog"
  >
    <div>
      <DetailRow typex="a" />
    </div>
    <div class="dialog_con">
      <div class="li" v-for="(item, index) in list" :key="index">
        <div class="image">
          <img src="@/assets/images/analyse/蒙版组 45.svg" alt="" />
        </div>
        <ul class="main">
          <li>
            <span>{{ setTitle.label_1 }}</span>
            <input v-model.trim="Form.value_1" type="text" />
          </li>
          <li>
            <span>{{ setTitle.label_2 }}</span>
            <input v-model.trim="Form.value_2" type="text" />
          </li>
          <li>
            <span>{{ setTitle.label_3 }}</span>
            <input v-model.trim="Form.value_3" type="text" />
          </li>
          <li>
            <span>{{ setTitle.label_4 }}</span>
            <input v-model.trim="Form.value_4" type="text" />
          </li>
          <li>
            <span>{{ setTitle.label_5 }}</span>
            <input v-model.trim="Form.value_5" type="text" />
          </li>
          <li v-if="typex == 'a'">
            <span>{{ setTitle.label_6 }}</span>
            <input v-model.trim="Form.value_6" type="text" />
          </li>
        </ul>
        <div class="footer">
          <el-button size="small" type="primary">修改</el-button>
          <el-button size="small" type="danger">删除</el-button>
        </div>
      </div>
    </div>

    <span slot="footer" class="dialog-footer">
      <Pagination :total="total" class="pagination" />
    </span>
  </el-dialog>
</template>


<script>
import DetailRow from '@/components/content/detailRow/DetailRow'
import Pagination from '@/components/content/pagination/Pagination'

export default {
  components: {
    DetailRow,
    Pagination
  },
  props: {
    typex: {
      type: String,
      default: ''
    },
    visible_a: {
      type: Boolean,
    },
    list: {
      type: Array,
      default() {
        return []
      }
    },
  },
  data() {
    return {
      Form: {
        value_1: null,
        value_2: null,
        value_3: null, // 籍贯
        value_4: null, // 证件号码
        value_5: null, // 地址
        value_6: null, // 备注
      },
      total: 100
    }
  },
  computed: {
    setTitle() {
      switch (this.typex) {
        case 'a':
          return {
            label_1: '姓名：',
            label_2: '性别：',
            label_3: '籍贯：',
            label_4: '证件号：',
            label_5: '地址：',
            label_6: '备注：'
          }
        case 'b':
          return {
            label_1: '姓名：',
            label_2: '车牌：',
            label_3: '颜色：',
            label_4: '款式：',
            label_5: '备注：',
            label_6: '',
          }
        case 'c':
          return {
            label_1: '姓名：',
            label_2: '帽子：',
            label_3: '口罩：',
            label_4: '上装颜色：',
            label_5: '备注：',
            label_6: '',
          }
      }
    }
  },
  methods: {
    handleCancel_a() {
      this.$emit('changeA')
    },
    handleOk_a() { },
  },
}
</script>

<style lang="scss" scoped>
.main {
  li {
    input {
      box-sizing: border-box;
      width: 100%;
      height: 21px;
      border: none;
      color: #fff;
      padding-left: 5px;
      background-color: transparent;
    }
    input:focus {
      outline: none;
      border-radius: 4px;
    }
  }
}

.dialog-footer {
  height: 30px;
}
::v-deep .el-dialog__footer {
  display: flex !important;
  justify-content: space-around !important;
}
</style>