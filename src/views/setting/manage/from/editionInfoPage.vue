<template>
  <div class="container">
    <ul>
      <li>
        <span>设备型号</span>
        <b class="right">xxxxxxxxxxxx</b>
      </li>
      <li>
        <span>序列号</span></span>
        <b class="right">xxxxxxxxxxxxxxx</b>
      </li>
      <li>
        <span>版本号</span>
        <b class="right">xxxxxxxxxxxx</b>
      </li>
      <li>
        <span>有效期</span>
        <div class="right">
          <span>长期有效</span>
          <img src="@/assets/images/analyse/蒙版组 45.svg" alt="">
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
ul {
  li {
    span,
    b {
      font-weight: 500;
    }

    .right {
      margin-left: 50px;
    }
  }

  li:last-child {
    display: flex;
    > div {
      display: flex;
      flex-direction: column;
    }
  }
  li:nth-child(2), 
  li:nth-child(3), 
  li:nth-child(4), 
  li:nth-child(5) {
    transform: translate(13.5px);
  }
}
</style>