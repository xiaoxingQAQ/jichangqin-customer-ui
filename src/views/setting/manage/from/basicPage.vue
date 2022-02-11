<template>
  <div class="container">
    <header>
      <span>系统名称：</span>
      <!-- <div>图像识别综合预警管理系统</div> -->
      <input v-model="name" placeholder="请输入系统名称"></input>
    </header>

    <main>
      <span style="display: block;margin-bottom: 10px;">LOGO设置</span>
      <div class="upload">
        <el-upload
          ref="upload"
          :limit="1"
          :on-success="handleOk"
          :on-exceed="onExceed"
          :headers="headers"
          :auto-upload="true"
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
      </div>
      <el-button type="success">确定</el-button>
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: '图像识别综合预警管理系统',

      ImageUrl: '', // 上传成功后的Url
    }
  },
  methods: {
    // 文件删除后
    handleRemove(file, fileList) {
      this.$refs.upload.clearFiles()
    },
    // 处理上传成功
    handleOk() { },
    // 处理超出限制
    onExceed() { },
  },
}
</script>

<style lang="scss" scoped>
header {
  display: flex;
  flex-direction: column;

  margin-bottom: 20px;
  span,
  input {
    font-weight: 500;
    font-size: 15px;
  }
  span {
    margin-bottom: 10px;
  }

  input {
    box-sizing: border-box;
    padding: 12px 0 12px 8px;
    width: 282px;
    height: 21px;
    border: none;
    background-color: #eff4ffff;
    border-radius: 3px;
  }
  input:focus {
    outline: none;
    border-radius: 4px;
  }
}

main {
  span {
    font-weight: 500;
  }
  .upload {
    margin-bottom: 20px;
  }
}
</style>